
'use client';
const getRandomNumber = (n:number) => {

    let retNum = "";
    for (let i = 0; i < n; i++) {
        retNum += Math.floor(Math.random() * 10)
    }
    return retNum;

}

const addComma = (price:number) => {
    const returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
}

const storeAccessToken = (accesstoken:string) => {
    return sessionStorage.setItem('accesstoken', accesstoken);
}

const getAccessToken = () => {
    return sessionStorage.getItem('accesstoken');
}

const clearAccessToken = () => {
    return sessionStorage.removeItem("accesstoken");
}

const getDate = (str:string) => {

    const year = str.substring(0, 4) + ".";;
    const month = str.substring(5, 7) + ".";;
    const day = str.substring(8, 10) + " ";;
    const time = str.substring(11, 19);;
    const retStr = year + month + day + time; 

    return retStr;
}

const getDateContraction = (str:string) => {
	const regex = /^[0-9]*$/; // 숫자만 체크
	let yyyymmee = "";
	for(let i=0; i<str.length; i++){
		if(regex.test(str[i])){
			yyyymmee = yyyymmee + str[i];
		}
	}


	

	const year = yyyymmee.substring(0, 4);
	let month = yyyymmee.substring(4, 6);
	const day = yyyymmee.substring(6, 8);
	
	if(month === "01"){ month = "Jan"} 
	else if(month === "02"){ month = "Feb"}
	else if(month === "03"){ month = "Mar"}
	else if(month === "04"){ month = "Apr"}
	else if(month === "05"){ month = "May"}
	else if(month === "06"){ month = "Jun"}
	else if(month === "07"){ month = "Jul"}
	else if(month === "08"){ month = "Aug"}
	else if(month === "09"){ month = "Sep"}
	else if(month === "10"){ month = "Oct"}
	else if(month === "11"){ month = "Nov"}
	else if(month === "12"){ month = "Dec"}
	
	const retStr =  month + " " +  day + ", " + year; 

	return retStr;
}

const getDateContraction2 = (str:string) => {

	if(!str){
		return;
	}

	const regex = /^[0-9]*$/; // 숫자만 체크
	let yyyymmdd = "";
	for(let i=0; i<str.length; i++){
		if(regex.test(str[i])){
			yyyymmdd = yyyymmdd + str[i];
		}
	}

	const year = yyyymmdd.substring(0, 4);
	const month = yyyymmdd.substring(4, 6);
	const day = yyyymmdd.substring(6, 8);

	
	const retStr =  year + "." +  month + "." + day; 

	return retStr;
}


const getChangedMongoDBTimestpamp = (str:string) => {

	if(!str){
		return;
	}
	const date = new Date(str); // UTC 시간
// // 로컬 시간(한국 기준)으로 변환하기 위해 시간 추가
	// const localDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000))
	var year = date.getFullYear().toString(); //년도 뒤에 두자리
	var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
	var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
	var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
	var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
	var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)

	return  month + "." + day + "." + year  +  " " + hour + ":" + minute + ":" + second

}


export  {getRandomNumber, addComma, storeAccessToken, getAccessToken, getDate, clearAccessToken
	, getDateContraction, getDateContraction2,getChangedMongoDBTimestpamp,
}