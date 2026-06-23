#!/bin/sh
set -eu

# Canonicalize comma-separated Iranian admin phones before the backend reads its environment.
normalized=""
old_ifs=$IFS
IFS=','
for raw_phone in ${ADMIN_PHONES:-}; do
  phone=$(printf '%s' "$raw_phone" | sed \
    -e 's/۰/0/g' -e 's/۱/1/g' -e 's/۲/2/g' -e 's/۳/3/g' -e 's/۴/4/g' \
    -e 's/۵/5/g' -e 's/۶/6/g' -e 's/۷/7/g' -e 's/۸/8/g' -e 's/۹/9/g' \
    -e 's/٠/0/g' -e 's/١/1/g' -e 's/٢/2/g' -e 's/٣/3/g' -e 's/٤/4/g' \
    -e 's/٥/5/g' -e 's/٦/6/g' -e 's/٧/7/g' -e 's/٨/8/g' -e 's/٩/9/g' \
    -e 's/[[:space:]()_-]//g')

  case "$phone" in
    +989*) canonical=$phone ;;
    00989*) canonical="+${phone#00}" ;;
    989*) canonical="+$phone" ;;
    09*) canonical="+98${phone#0}" ;;
    9*) canonical="+98$phone" ;;
    *) canonical=$phone ;;
  esac

  if [ -n "$canonical" ]; then
    if [ -n "$normalized" ]; then normalized="$normalized,$canonical"; else normalized=$canonical; fi
  fi
done
IFS=$old_ifs

export ADMIN_PHONES=$normalized
exec /app/server
