const baseURL = 'https://dev-nakama.winterpixel.io/v2';
const test_email = 'testsubject105@gmail.com';
const test_password = 'password';
const test_id = '52839799-0bad-4786-879b-8d5d9924d5cb';

// Function to update the token
async function updateToken() {
  const response = await fetch(
    `https://dev-nakama.winterpixel.io/v2/account/authenticate/custom?create=true&`,
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        authorization: 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=',
        priority: 'u=1, i',
      },
      body: `{"email":"${test_email}","password":"${test_password}","id":"${test_id}","vars":{"client_version":"67","platform":"HTML5"}}`,
      method: 'POST',
    },
  );
  const json = await response.json();
  return json['token'];
}

// Function to get profile information by ID
async function getProfile(id, token) {
  const response = await fetch(`${baseURL}/rpc/rpc_get_users_with_profile`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer ${token}`,
    },
    body: `\"{\\\"ids\\\":[\\\"${id}\\\"]}\"`,
    method: 'POST',
  });
  return await response.json();
}

// Main function to handle requests
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle /v2/account/json/getProfile endpoint
  if (pathname === '/v2/account/json/getProfile') {
    const { id } = url.searchParams;

    if (!id) {
      return new Response('playerID is required', { status: 400 });
    }

    try {
      const token = await updateToken();
      const playerData = await getProfile(id, token);
      return new Response(JSON.stringify(playerData), { status: 200 });
    } catch (err) {
      return new Response('Failed to fetch player data', { status: 500 });
    }
  }

  // Handle /v2/account/json/fcToID endpoint
  else if (pathname === '/v2/account/json/fcToID') {
    const { fc } = url.searchParams;

    if (!fc) {
      return new Response('friend code is required', { status: 400 });
    }

    try {
      const token = await updateToken();
      const playerData = await fetch(
        `https://dev-nakama.winterpixel.io/v2/rpc/winterpixel_query_user_id_for_friend_code`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            authorization: `Bearer ${token}`,
          },
          body: `\"{\\\"friend_code\\\":\\\"${fc}\\\"}\"`,
        },
      );
      const jsonData = await playerData.json();
      return new Response(JSON.stringify(jsonData), { status: 200 });
    } catch (err) {
      return new Response('Failed to fetch player data', { status: 500 });
    }
  }

  // Default response for all other routes
  return new Response('Route not found', { status: 404 });
}

// Event listener to handle incoming fetch requests
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
