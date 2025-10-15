'use client';
const checkInputData = (userObj:any) => {
    //userName:'', email:'', password:'', repassword:''
    
  interface retType {
    yn:boolean,
    str:string,
    field:string,
  }
  
  const retObj:retType = {yn:true, str:"", field:""}


  const regExp = /^[a-zA-Z0-9]{6,20}$/; //name check
  const e_regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const pw_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

  if(userObj.email == ""){
      retObj.yn = false;
      retObj.field = "email";
      retObj.str = "Please check your email";
      return retObj;
  }

  if(userObj.password == ""){
      retObj.yn = false;
      retObj.field = "password";
      retObj.str = "Please check your password";
      return retObj;
  }

  if(userObj.repassword == ""){
      retObj.yn = false;
      retObj.field = "repassword";
      retObj.str = "Please check your repassword";
      return retObj;
  }

  if(!e_regExp.test(userObj.email)){
      retObj.yn = false;
      retObj.field = "email";
      retObj.str = "Please check your email";
      return retObj;
  }
  if(!regExp.test(userObj.name.replaceAll(" ", ""))){
      retObj.yn = false;
      retObj.field = "name";
      retObj.str = "Please enter 6 to 20 digits (alphabet, numbers)";
      return retObj;
  }

  if(userObj.password != userObj.repassword){
      retObj.yn = false;
      retObj.field = "password";
      retObj.str = "Please check your password";
      return retObj;
  }

  if(!pw_regex.test(userObj.password)){
      retObj.yn = false;
      retObj.field = "pw_regex";
      retObj.str = "Please use 8 to 20 characters, letters, numbers, and special characters.";
      return retObj;
  }

  retObj.yn = true;
  retObj.field = "";
  retObj.str = "success";
  return retObj;

}

const checkPassword = (pwObj:any, language:string) => {
  interface retType {
      yn:boolean,
      str:string,
      field:string,
  }
  
  const retObj:retType = {yn:true, str:"", field:""}

  const pw_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

  if(pwObj.password == ""){
    retObj.yn = false;
    retObj.field = "password";
    // retObj.str = "비밀번호를 확인해주세요.";

    if(language === "us"){
      retObj.str = "Please check your password.";            
    }else if(language === "kr"){
      retObj.str = "비밀번호를 확인해주세요.";
    }else if(language === "mx"){
      retObj.str = "Por favor revise su contraseña.";
    }else{
      retObj.str = "Please check your password.";
    }
    
    return retObj;
  }

  if(pwObj.rePassword == ""){
    retObj.yn = false;
    retObj.field = "rePassword";
    // retObj.str = "비밀번호 재확인을 확인해주세요.";

    if(language === "us"){
      retObj.str = "Please confirm your password again.";            
    }else if(language === "kr"){
      retObj.str = "비밀번호 재확인을 확인해주세요.";
    }else if(language === "mx"){
      retObj.str = "Por favor confirme su contraseña nuevamente.";
    }else{
      retObj.str = "Please confirm your password again.";
    }

    return retObj;
  }

  if(pwObj.password != pwObj.rePassword){
    retObj.yn = false;
    retObj.field = "rePassword";
    // retObj.str = "비밀번호 재확인을 확인해주세요.";

    if(language === "us"){
      retObj.str = "Please confirm your password again.";            
    }else if(language === "kr"){
      retObj.str = "비밀번호 재확인을 확인해주세요.";
    }else if(language === "mx"){
      retObj.str = "Por favor confirme su contraseña nuevamente.";
    }else{
      retObj.str = "Please confirm your password again.";
    }

    return retObj;
  }

  if(!pw_regex.test(pwObj.password)){
    retObj.yn = false;
    retObj.field = "pw_regex";
    // retObj.str = "영문, 숫자, 특수문자 조합 8~20자리";

    if(language === "us"){
      retObj.str = "8 to 20 characters of English letters, numbers, and special characters.";            
    }else if(language === "kr"){
      retObj.str = "영문, 숫자, 특수문자 조합 8~20자리";
    }else if(language === "mx"){
      retObj.str = "De 8 a 20 caracteres de letras, números y caracteres especiales en inglés..";
    }else{
      retObj.str = "8 to 20 characters of English letters, numbers, and special characters.";
    }

    return retObj;
  }

  retObj.yn = true;
  retObj.field = "";
  retObj.str = "success";
  return retObj;

}

const checkEmail = (emObj:any, language:string) => {
  interface retType {
    yn:boolean,
    str:string,
    field:string,
  }
  
  const retObj:retType = {yn:true, str:"", field:""}

  const e_regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  if(emObj.email == ""){
    retObj.yn = false;
    retObj.field = "email";

    if(language === "us"){
        retObj.str = "Please check your email.";            
    }else if(language === "kr"){
        retObj.str = "이메일을 확인해주세요.";
    }else if(language === "mx"){
        retObj.str = "Por favor revise su correo electrónico.";
    }else{
        retObj.str = "Please check your email.";
    }

    return retObj;
  }

  if(!e_regExp.test(emObj.email)){
    retObj.yn = false;
    retObj.field = "email";

    if(language === "us"){
      retObj.str = "Please check your email.";            
    }else if(language === "kr"){
        retObj.str = "이메일을 확인해주세요.";
    }else if(language === "mx"){
        retObj.str = "Por favor revise su correo electrónico.";
    }else{
        retObj.str = "Please check your email.";
    }

    return retObj;
  }

  retObj.yn = true;
  retObj.field = "";
  retObj.str = "success";
  return retObj;
}

const checkInputNull = (value:string) => {
  if(value === "") return false;
  return true;
}

export {checkInputData, checkPassword, checkEmail, checkInputNull};