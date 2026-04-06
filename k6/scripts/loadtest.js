import http from 'k6/http';
import { sleep, check } from 'k6';

// ✅ ENV VARIABLES
const BASE_URL = __ENV.BASE_URL;
const EMAIL = __ENV.EMAIL;
const PASSWORD = __ENV.PASSWORD;

// ✅ LOAD CONFIG (balanced for CI)
export let options = {
  stages: [
    { duration: '30s', target: 50 },   // ramp up
    { duration: '1m', target: 200 },   // normal load
    { duration: '2m', target: 500 },   // heavy load
    { duration: '30s', target: 0 },    // ramp down
  ],
};

// ✅ LOGIN FUNCTION
function login() {
  const payload = JSON.stringify({
    email: EMAIL,
    password: PASSWORD,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/auth/signin`, payload, params);

  check(res, {
    'login success': (r) => r.status === 200 || r.status === 201,
  });

  const body = res.json();

  return body.access_token;
}

// ✅ MAIN TEST
export default function () {
  // 🔹 Step 1: Login
  const token = login();

  // 🔹 Step 2: Auth headers
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 🔹 Step 3: Hit APIs (real user flow)
  let res1 = http.get(`${BASE_URL}/banner-ads?approved=true&placement=WALLET_DETAILS`);
  let res2 = http.get(`${BASE_URL}/user/me`, authHeaders);

  check(res1, {
    'banner loaded': (r) => r.status === 200,
  });

  check(res2, {
    'profile loaded': (r) => r.status === 200,
  });

  sleep(1);
}
