export async function sendRequest(method, body, url){
    try{
        let payload = {
            method: method,
            headers: {
                "Content-Type": 'application/json'
                //Since this is free not authnetication will be needed but I will hide my details with post your url kind of a situation!
            }
        }
        if(method!=="GET"){
            payload.body = JSON.stringify(body)
        }
        console.log("payload before sending", payload);
        const res = await fetch(url, payload);
        const data = await res.json();
        console.log("payoload is", payload);
        console.log("Response", JSON.stringify(data));
        return data.body;
    }
    catch(error){
        console.log("error", error);
        return {statusCode: 500, body:error.message}
    }
}