import axios from "axios";
import { getAccessToken, storeAccessToken } from "./common";

const axiosAuth = axios.create({
	baseURL : process.env.API_URL, 
	withCredentials: true,
})

axiosAuth.interceptors.request.use((config)=>{
	config.headers["accesstoken"] = getAccessToken();
	return config;
})

const transactionAuth = async (type:string, url:string, obj:any, callback:any, callbackYn:boolean, loadingScreenYn:any, screenShow:any, errorPage:any) => {
	if(loadingScreenYn === true) screenShow.screenShowTrue();
	try{
    let resp:any, data:any;
		
		if(type === "get"){
			resp = await axiosAuth.get(url, {params:obj});
			data = await resp.data;
		}else if(type === "post"){
			resp = await axiosAuth.post(url ,obj);
			data = await resp.data;
		}

		if(data.sendObj.code === "2011"){ //access token check failed
			resp = await axiosAuth.get('user/getAccessToken', {});
			data = await resp.data;

			if(data.sendObj.success){
				storeAccessToken(resp.headers.accesstoken);
				let _resp:any, _data:any;
				if(type === "get"){
					_resp = await axiosAuth.get(url, {params:obj});
					_data = await _resp.data;
				}else if(type === "post"){
					_resp = await axiosAuth.post(url ,obj);
					_data = await _resp.data;
				}
				if(_data.success){
					_data.user = data.user;
					_data.regetAccessToken = true;
				}

				data = _data;
			}else{
				//failed 
				data.refreshTokenCheckFail = true;
			}

		}

		// }

		if(loadingScreenYn === true) screenShow.screenShowFalse();

		if(callbackYn){
			callback(data);
		}else{

			return data;
		}
	}
	catch(error:any){
		if(loadingScreenYn === true) screenShow.screenShowFalse();
		if(errorPage !== null){
			errorPage.screenShowTrue();
			errorPage.messageSet(error.response.data.message);
		} 
		if(error){
			const resObj = {
				sendObj : {
					success : "n",
					code: error.response.data.code,
					message : error.response.data.message
				}
			}
			if(callbackYn){
				callback("", resObj);
			}else{
				return resObj;
			}
		}
	}
}

export {transactionAuth}; 