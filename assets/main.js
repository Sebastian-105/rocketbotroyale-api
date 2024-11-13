

// ============================== MAIN FILE DOWN =====================================

let test_email = "testsubject105@gmail.com";
let test_password = "password";
let test_id = "52839799-0bad-4786-879b-8d5d9924d5cb";

// Update token function using Axios
const res = await fetch(
  "https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false",
  {
    method: "POST",
    headers: {
      authorization: "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=",
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      vars: {client_version: "99999"},
    }),
  } 
)
alert(res)
async function updateToken() {
  try {
    const response = await axios.post(
      `https://dev-nakama.winterpixel.io/v2/account/authenticate/custom?create=true&`,
      {
        email: test_email,
        password: test_password,
        id: test_id,
        vars: {
          client_version: "67",
          platform: "HTML5",
        },
      },
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          authorization: "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Referer: "https://rocketbotroyale.winterpixel.io/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    console.log(response.data);
    alert(response.data["token"]);
    return response.data["token"];
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error response:", error.response);
      alert("Error response: " + error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
      alert("Error request: No response received.");
    } else {
      // Something else caused the error
      console.error("Error message:", error.message);
      alert("Error: " + error.message);
    }
  }
}

// Function to query user ID for the friend code using Axios
// async function fcToID(fc, token) {
//   const data = { friend_code: fc };
//   console.log("Sending request with data:", data);

//   try {
//     const response = await axios.post(
//       `https://dev-nakama.winterpixel.io/v2/rpc/winterpixel_query_user_id_for_friend_code`,
//       data,
//       {
//         headers: {
//           accept: "application/json",
//           "accept-language": "en-US,en;q=0.9",
//           authorization: `Bearer ${token}`,
//           priority: "u=1, i",
//           "sec-ch-ua": '"Chromium";v="127", "Not)A;Brand";v="99"',
//           "sec-ch-ua-mobile": "?0",
//           "sec-ch-ua-platform": '"Linux"',
//           "sec-fetch-dest": "empty",
//           "sec-fetch-mode": "cors",
//           "sec-fetch-site": "same-site",
//           Referer: "https://rocketbotroyale.winterpixel.io/",
//           "Referrer-Policy": "strict-origin-when-cross-origin",
//         },
//       }
//     );
//     console.log("Response status:", response.status);
//     alert("Response status: " + response.status);
//     return response.data;
//   } catch (error) {
//     console.error("Error with fcToID:", error);
//     alert("Fetch error: " + error);
//   }
// }

// Main function to orchestrate the flow
async function main() {
  let token = await updateToken();
  let friend_code = await fcToID("9d5ceb83", token);
}
main();
