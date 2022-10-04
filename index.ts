import http from "http";

type DeonayResponse = {
  "user": {
    email: string
  },
  "users": Array<DeonayResponse["user"]>
}

function fetch(apiKey: string, resource: keyof DeonayResponse) {
  return new Promise<DeonayResponse[typeof resource]>((success, fail) => {
    let result = "";
    http.get(`http://localhost:8080/api/rest/${resource}`, {
      headers: {
        "x-api-key": apiKey,
        "x-hasura-role": "api"
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