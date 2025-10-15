import axios from "axios";
import { getAccessToken, storeAccessToken } from "./common";

const axiosFile = axios.create({
	baseURL : process.env.API_URL, 
	withCredentials: true,
	headers: {
		"Contest-Type": "multipart/form-data"
    }
})

axiosFile.interceptors.request.use((config)=>{
	config.headers["accesstoken"] = getAccessToken();
	return config;
})


const transactionFile = async (url:string, fileObj:any, obj:any, callback:any, callbackYn:boolean, loadingScreenYn:any, screenShow:any, errorPage:any) => {

	if(loadingScreenYn === true) screenShow.screenShowTrue();
	try{
		const formData = new FormData();
		formData.append('file', fileObj);
		formData.append('user_id', obj.user_id);
		formData.append('temp_num', obj.randomNum);
		formData.append('email', obj.email);

		if(obj.blog_seq){
			formData.append('blog_seq', obj.blog_seq);
		}
		
        let resp:any, data:any;
		
		resp = await axiosFile.post(url ,formData, obj);
		data = await resp.data;
		
		
			
		if(data.sendObj.code === "2011"){ //access token check failed
			resp = await axiosFile.get('getAccessToken', {});
			data = await resp.data;

			if(data.sendObj.success){
				storeAccessToken(resp.headers.accesstoken);
				const _resp = await axiosFile.post(url ,obj);
				const _data = await _resp.data;
				
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

export {transactionFile}; 