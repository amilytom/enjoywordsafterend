const timeFormat = {
  /*
   * 格式化时间，将中国标准时间: Tue Dec 31 2019 00:00:00 GMT+0800转换成YYYY-mm-dd
   * @param standardDate datetime 待转化的时间 必填
   * @param format string 格式化时间的标准 默认为 "yyyy-mm-dd" 可选"yyyy-mm-dd hh:mm:ss"
   * @returns {datetime} yyyy-mm-dd
   * */
  dateFormat: function (standardDate, format = "") {
    let year = standardDate.getFullYear();
    let month =
      standardDate.getMonth() + 1 > 9
        ? standardDate.getMonth() + 1
        : "0" + (standardDate.getMonth() + 1);
    let date =
      standardDate.getDate() > 9
        ? standardDate.getDate()
        : "0" + (standardDate.getMonth() + 1);
    let hour =
      standardDate.getHours() > 9
        ? standardDate.getHours()
        : "0" + standardDate.getHours();
    let minutes =
      standardDate.getMinutes() > 9
        ? standardDate.getMinutes()
        : "0" + standardDate.getMinutes();
    let second =
      standardDate.getSeconds() > 9
        ? standardDate.getSeconds()
        : "0" + standardDate.getSeconds();
    let datetime;
    if (
      format.toLocaleLowerCase() === "yyyy-mm-dd" ||
      format.toLocaleLowerCase() === ""
    ) {
      datetime = year + "-" + month + "-" + date;
      return datetime;
    } else if (format.toLocaleLowerCase() === "yyyy-mm-dd hh:mm:ss") {
      datetime =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        second;
      return datetime;
    } else {
      return `输入的时间格式有误`;
    }
  },

  /*
   * 格式化时间 将2020-07-25T10:23:49.000+0000转换成 YYYY-mm-dd hh:mm:ss
   * @param date {datetime} 待转化的时间 必填
   * @param format {string} 格式化时间的标准 默认为 "yyyy-mm-dd"
   * 可选"yyyy/mm/dd"，"yyyy-mm-dd hh:mm:ss","yyyy/mm/dd hh:mm:ss"
   * @returns {datetime} yyyy-mm-dd
   * */
  dateFilter: function (date, format = "") {
    var dt = new Date(date);
    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1).toString().padStart(2, "0");
    var d = dt.getDate().toString().padStart(2, "0");
    var h = dt.getHours().toString().padStart(2, "0");
    var mm = dt.getMinutes().toString().padStart(2, "0");
    var s = dt.getSeconds().toString().padStart(2, "0");
    if (
      format.toLocaleLowerCase() === "yyyy-mm-dd" ||
      format.toLocaleLowerCase() === ""
    ) {
      return `${y}-${m}-${d}`;
    } else if (format.toLocaleLowerCase() === "yyyy/mm/dd") {
      return `${y}/${m}/${d}`;
    } else if (format.toLocaleLowerCase() === "yyyy-mm-dd hh:mm:ss") {
      return `${y}-${m}-${d} ${h}:${mm}:${s}`;
    } else if (format.toLocaleLowerCase() === "yyyy/mm/dd hh:mm:ss") {
      return `${y}/${m}/${d} ${h}:${mm}:${s}`;
    } else {
      return `输入的时间格式有误`;
    }
  },

  /**
   * 格式化时间 把中国标准时间Tue Dec 31 2019 00:00:00 GMT+0800转化为时间戳(number) 1508750413000
   * @param {string} date
   * @returns {number} 时间戳
   * */
  dateToTimestamp: function (date) {
    let result = new Date(date).getTime();
    return result;
  },

  /**
   * @function 时间戳转化为年月日
   * @param {number} 时间戳 timestamp 1578653565000
   * @returns {datetime} datetime 2020-01-10 18:52
   * */
  timestampToDate: function (timestamp) {
    const date = new Date(parseInt(timestamp));
    console.log(date);
    const Y = date.getFullYear() + "-";
    const M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    const D =
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    const h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    const m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    const s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    const dateString = Y + M + D + h + m + s; // > dateString 2020-01-10 18:52
    return dateString;
  },
};

export default timeFormat;
