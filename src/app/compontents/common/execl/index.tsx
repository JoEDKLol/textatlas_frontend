import * as XLSX from 'xlsx';

const readExcel = (file:any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e:any) => {
      const buffer = e.target.result;
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      resolve(data);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}; 

export {readExcel};