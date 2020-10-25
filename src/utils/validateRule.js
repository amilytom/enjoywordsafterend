import { test } from "shelljs";

/* eslint-disable */
const valiadteRule = {
  // 验证密码位数
  validatePassword: (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("密码不能小于6位"));
    } else {
      callback();
    }
  },

  // 验证电话号码（座机和手机）
  validatePhone: (rule, value, callback) => {
    let reg1 = /(^1[2|3|4|5|6|7|8|9]\d{9}$)/; // 手机号验证
    let reg2 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/; // 座机号验证
    if (!reg1.test(value) && !reg2.test(value)) {
      callback(new Error("电话格式不正确，如：13888888888 或 027-66666666"));
    } else {
      callback();
    }
  },

  // 验证固定电话号码
  validateTel: (rule, value, callback) => {
    let reg = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/; // 座机号验证
    if (!reg.test(value)) {
      callback(
        new Error("电话格式不正确，请输入带区号的固定电话，如：027-66666666")
      );
    } else {
      callback();
    }
  },

  // 验证邮箱
  validateEmail: (rule, value, callback) => {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!reg.test(value)) {
      callback(new Error("电子邮箱格式不正确，如：blue@163.com"));
    } else {
      callback();
    }
  },

  // 验证不能为特殊字符，只允许中文、字母+数字
  validateNoSpecial: (rule, value, callback) => {
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
      callback(new Error("不能为特殊字符，只允许中文、字母、数字"));
    } else {
      callback();
    }
  },

  // 验证姓名为中文
  validateChineseName: (rule, value, callback) => {
    let reg = /^[\u4e00-\u9fa5]+$/; // 汉字验证
    if (!reg.test(value)) {
      callback(new Error("姓名必须是中文"));
    } else {
      callback();
    }
  },

  // 验证不能为中文字符
  validateChinese: (rule, value, callback) => {
    let reg = /[\u4e00-\u9fa5]+/; // 汉字验证
    if (reg.test(value)) {
      callback(new Error("不能有中文字符"));
    } else {
      callback();
    }
  },

  // 账号格式
  validateAccountFormat: (rule, value, callback) => {
    let reg = /^[0-9a-zA-Z]*$/; // 数字+英文
    if (!reg.test(value)) {
      callback(new Error("输入格式不正确。如：TEST或test08"));
    } else {
      callback();
    }
  },

  // 验证手机号码
  validateCellPhone: (rule, value, callback) => {
    let reg = /(^1[2|3|4|5|6|7|8|9]\d{9}$)/; // 手机号验证
    if (!reg.test(value)) {
      callback(new Error("手机号码格式不正确"));
    } else {
      callback();
    }
  },

  // 验证是否为货币型数值
  validateMoney: (rule, value, callback) => {
    let reg = /^\d+(?:\.\d{0,2})?$/;
    if (!reg.test(value) || value == 0) {
      callback(new Error("请输入正确的金额数值"));
    } else {
      callback();
    }
  },

  // 确认密码验证。(传入两个参数，1.this，2.表单值的名称字符串)
  validateConfirm: (that, formValName) => {
    return function (rule, value, callback) {
      if (value !== that[formValName].password) {
        callback(new Error("两次输入的密码不相同"));
      } else {
        callback();
      }
    };
  },

  // 验证是否整数
  isInteger: (rule, value, callback) => {
    if (!value) {
      return callback(new Error("输入不可以为空"));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error("请输入正整数"));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    }, 0);
  },
};
export default valiadteRule;
