const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

app.get('/ping-api', async (req, res) => {
    try {
      const email = "naitsabes105@gmail.com"
      const password = "FOUND105adopt"
      const times = 1;
      const maxPings = parseInt(times, 10);
        let pingCount = 0;
        let results = [];

        // Function to fetch items
        async function getItem() {
            while (pingCount < maxPings) {
                try {
                    // Step 1: Authenticate and get the token
                    const authResponse = await axios.post(
                        'https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false',
                        JSON.stringify({
                            email: email,
                            password: password,
                            vars: { client_version: "99999" }
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo='
                            }
                        }
                    );

                    // Step 2: Extract the token from the response
                    const token = authResponse.data.token;
                    console.log(token)
                    if (!token) {
                        results.push(`Error on ping ${pingCount + 1}: No token received.`);
                        console.log(`Error on ping ${pingCount + 1}: No token received.`)
                        return results;
                    }

                    // Step 3: Send the lootbox request with the token and payload
                    const payload = "{}";  // Send '{}' as a string
                    const lootboxResponse = await axios.post(
                        'https://dev-nakama.winterpixel.io/v2/rpc/tankkings_consume_lootbox',
                        payload,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    // Step 4: Collect the response
                    results.push(`Ping ${pingCount + 1}: ${JSON.stringify(lootboxResponse.data)}`);
                    console.log(`Ping ${pingCount + 1}: ${JSON.stringify(lootboxResponse.data)}`);


                } catch (error) {
                    results.push(`Error on ping ${pingCount + 1}: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
                    console.log(`Error on ping ${pingCount + 1}: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
                }

                pingCount++;

                // Optional delay to avoid too frequent requests
                await new Promise(resolve => setTimeout(resolve, 1000));  // 1-second delay between requests
            }

            return results;
        }

        const finalResults = await getItem();

        res.status(200).json({
            message: `Finished pinging the API ${maxPings} times.`,
            results: finalResults
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
