import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;

export let options = {
  stages: [
    { duration: '1m', target: 200 },
    { duration: '2m', target: 1000 },
    { duration: '2m', target: 2000 }, // push limits
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  http.get(`${BASE_URL}/banner-ads?approved=true&placement=WALLET_DETAILS`);
  sleep(0.5);
}
