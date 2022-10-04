import http from "http";

type DeonayResponse = {
  "user": {
    email: string
  },
  "users": Array<DeonayResponse["user"]>
}

function fetch(apiKey: string, resource: keyof DeonayResponse, data?: Object) {
  return new Promise<DeonayResponse[typeof resource]>((success, fail) => {
    let result = "";
    const datastr = JSON.stringify(data || {});

    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/rest/${resource}`,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(datastr) } : {}),
      }
    }, (res) => {

      res.on('data', (d) => {
        result += d;
      });
  
      res.on('end', () => {
        success(JSON.parse(result));
      })
  
    }).on('error', (e) => {
      fail(e);
    });

    // Write data to request body
    if (data) {
      req.write(datastr);
    }
    req.end();
  })
}


class DeonayClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  users = {
    list: () => async () => await fetch(this.apiKey, "users"),

    getById: async () => await fetch(this.apiKey, "user"),


  }
}

export default DeonayClient;