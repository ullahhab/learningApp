import axios from "axios";
export async function sendRequest(payload){
    console.log("getting here", payload);
    try{
        const res = await axios.post("https://learning-8e4vrhcvn-hammadullahris-1789s-projects.vercel.app/api/handler",payload);
        console.log(payload);
        console.log(res);
        return res;
    }
    catch(error){
        return {statusCode: 500, body:error.message}
    }
}