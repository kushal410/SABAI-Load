import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;

export let options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 2000 }, // sudden spike
    { duration: '10s', target: 100 },
  ],
};

export default function () {
  http.get(`${BASE_URL}/banner-ads?approved=true&placement=WALLET_DETAILS`);
  sleep(0.2);
}
