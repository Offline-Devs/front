import http from "node:http";

const port = Number(process.env.MOCK_BACKEND_PORT || 18080);
const now = "2026-06-21T08:00:00Z";
let state;
function reset() {
  state = { profile: null, exams: [], mistakes: [], posts: [] };
}
reset();
const studentUser = {
  id: "11111111-1111-4111-8111-111111111111",
  phone: "+989121234567",
  role: "student",
  is_active: true,
  created_at: now,
  updated_at: now,
};
const adminUser = {
  ...studentUser,
  id: "99999999-9999-4999-8999-999999999999",
  phone: "+989000000000",
  role: "admin",
};
function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}
async function body(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const path = url.pathname;
    if (path === "/__reset") {
      reset();
      return json(response, 200, { ok: true });
    }
    if (path === "/__seed-student") {
      state.profile = {
        id: "22222222-2222-4222-8222-222222222222",
        user_id: studentUser.id,
        first_name: "سارا",
        last_name: "احمدی",
        city: "بابل",
        school: "نمونه",
        major: "تجربی",
        jalali_birth_date: "1386/12/29",
        birth_date: now,
        profile_photo: "",
        is_approved: false,
        dynamic_fields: {},
        created_at: now,
        updated_at: now,
        user: studentUser,
      };
      return json(response, 200, state.profile);
    }
    if (path === "/auth/request-otp")
      return json(response, 200, { message: "otp sent", otp: "123456" });
    if (path === "/auth/verify-otp") {
      const input = await body(request);
      const user = input.phone === adminUser.phone ? adminUser : studentUser;
      return json(response, 200, {
        access_token: `access-${user.role}`,
        refresh_token: `refresh-${user.role}`,
        expires_in: 3600,
        user,
      });
    }
    if (path === "/auth/refresh")
      return json(response, 200, { access_token: "refreshed-access", expires_in: 3600 });
    if (path === "/majors")
      return json(response, 200, [{ major: "تجربی", subjects: ["زیست‌شناسی"] }]);
    if (path === "/subjects")
      return json(response, 200, {
        major: url.searchParams.get("major") || "تجربی",
        subjects: ["زیست‌شناسی"],
      });
    if (path === "/dynamic-fields") return json(response, 200, []);
    if (path === "/students/profile" && request.method === "GET")
      return state.profile
        ? json(response, 200, state.profile)
        : json(response, 404, { error: "profile not found" });
    if (path === "/students/profile" && request.method === "POST") {
      const input = await body(request);
      state.profile = {
        ...input,
        id: "22222222-2222-4222-8222-222222222222",
        user_id: studentUser.id,
        birth_date: now,
        is_approved: false,
        dynamic_fields: input.dynamic_fields || {},
        created_at: now,
        updated_at: now,
        user: studentUser,
      };
      return json(response, 200, state.profile);
    }
    if (path === "/students/dashboard")
      return json(response, 200, {
        total_exams: state.exams.length,
        total_mistakes: state.mistakes.length,
        average_score: 80,
        recent_exams: state.exams,
        is_approved: false,
        has_study_plan: false,
      });
    if (path === "/students/statistics")
      return json(response, 200, {
        total_exams: state.exams.length,
        average_score: 80,
        subject_stats: [],
        trend_data: [],
        mistakes_by_reason: {},
      });
    if (path === "/students/performance") return json(response, 200, []);
    if (path === "/exams" && request.method === "GET") return json(response, 200, state.exams);
    if (path === "/exams" && request.method === "POST") {
      const input = await body(request);
      const exam = {
        ...input,
        id: "44444444-4444-4444-8444-444444444444",
        student_id: state.profile?.id,
        exam_date: now,
        created_at: now,
        updated_at: now,
        subjects: input.subjects.map((item, index) => ({
          ...item,
          id: `33333333-3333-4333-8333-33333333333${index}`,
          exam_id: "44444444-4444-4444-8444-444444444444",
          percentage: 80,
        })),
      };
      state.exams = [exam];
      return json(response, 201, exam);
    }
    if (path.startsWith("/exams/") && request.method === "GET") {
      const exam = state.exams.find((item) => item.id === path.split("/").pop());
      return exam ? json(response, 200, exam) : json(response, 404, { error: "exam not found" });
    }
    if (path === "/mistakes" && request.method === "GET")
      return json(response, 200, state.mistakes);
    if (path === "/mistakes" && request.method === "POST") {
      const input = await body(request);
      const mistake = {
        ...input,
        id: "55555555-5555-4555-8555-555555555555",
        student_id: state.profile?.id,
        created_at: now,
        updated_at: now,
      };
      state.mistakes = [mistake];
      return json(response, 201, mistake);
    }
    if (path === "/admin/students/with-stats")
      return json(response, 200, {
        data: state.profile
          ? [
              {
                ...state.profile,
                exam_count: state.exams.length,
                mistake_count: state.mistakes.length,
              },
            ]
          : [],
        total: state.profile ? 1 : 0,
        page: 1,
        limit: 20,
      });
    if (path === `/admin/students/${state.profile?.id}` && request.method === "GET")
      return json(response, 200, state.profile);
    if (path === `/admin/students/${state.profile?.id}/exams`)
      return json(response, 200, state.exams);
    if (path === `/admin/students/${state.profile?.id}/mistakes`)
      return json(response, 200, state.mistakes);
    if (path === `/admin/students/${state.profile?.id}/performance`) return json(response, 200, []);
    if (path === `/admin/students/${state.profile?.id}/statistics`)
      return json(response, 200, {
        total_exams: 0,
        average_score: 0,
        subject_stats: [],
        trend_data: [],
        mistakes_by_reason: {},
      });
    if (path.endsWith("/approve") && request.method === "PUT") {
      state.profile = { ...state.profile, is_approved: true };
      return json(response, 200, { status: "approved" });
    }
    if (path === "/admin/blog" && request.method === "GET") return json(response, 200, state.posts);
    if (path === "/admin/blog" && request.method === "POST") {
      const input = await body(request);
      const post = {
        ...input,
        id: "77777777-7777-4777-8777-777777777777",
        created_at: now,
        updated_at: now,
      };
      state.posts = [post];
      return json(response, 200, post);
    }
    if (path === "/admin/dynamic-fields") return json(response, 200, []);
    return json(response, 404, { error: "not mocked", path, method: request.method });
  })
  .listen(port, "127.0.0.1", () => process.stdout.write(`mock backend ${port}\n`));
