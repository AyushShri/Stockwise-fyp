const sql = require("../config/db.js");

const userTbl = "alerts";
const Alerts = function (alerts) {
    this.id = alerts.id;
    this.alert_type_id = alerts.alert_type_id;
	this.alert_type_sub_id = alerts.alert_type_sub_id;
    this.preference_data = alerts.preference_data;
    this.remarks = alerts.remarks;
    this.user_id = alerts.user_id;
    this.stock_name = alerts.stock_name;
};
Alerts.insertAlert = ({alert_type_id,alert_type_sub_id,preference_data,remarks,user_id,stock_name}) => {
    return sql.execute("INSERT INTO "+userTbl+" (alert_type_id,alert_type_sub_id,preference_data,remarks,user_id,stock_name) VALUES (?,?,?,?,?,?)",[alert_type_id,alert_type_sub_id,preference_data,remarks,user_id,stock_name]);
};
Alerts.updateAlert = ({alert_type_id,alert_type_sub_id,preference_data,remarks,id}) => {
    const query = "UPDATE "+userTbl+" SET alert_type_id = "+alert_type_id+", alert_type_sub_id ="+alert_type_sub_id+", preference_data="+preference_data+",remarks='"+remarks+"' WHERE id = "+id;
    console.log(query)
    return sql.execute(query);
};
Alerts.deleteAlert = ({id}) => {
    const query = "DELETE FROM "+userTbl+" WHERE id = "+id;
    return sql.execute(query);
};
Alerts.getAlerts = (id) => {
    const query = "SELECT *,"+userTbl+".id as id,atm.name as alert_type_name,atsm.name as alert_type_sub_name FROM "+userTbl+" INNER JOIN "+
    "alert_type_master as atm ON atm.id = "+userTbl+".alert_type_id INNER JOIN "+
    "alert_type_sub_master as atsm ON atsm.id = "+userTbl+".alert_type_sub_id"+
    " WHERE "+userTbl+".id = '"+id+"'";
	return sql.execute(query);
};
Alerts.getAllAlerts = (userId) => {
    const query = "SELECT *,"+userTbl+".id as id,atm.name as alert_type_name,atsm.name as alert_type_sub_name FROM "+userTbl+" INNER JOIN "+
    "alert_type_master as atm ON atm.id = "+userTbl+".alert_type_id INNER JOIN "+
    "alert_type_sub_master as atsm ON atsm.id = "+userTbl+".alert_type_sub_id"+
    " WHERE "+userTbl+".user_id = '"+userId+"'";
	return sql.execute(query);
};
Alerts.getAllAlertsByUserId = (userId) => {
    const query = "SELECT *,"+userTbl+".id as id,atm.name as alert_type_name,atsm.name as alert_type_sub_name FROM "+userTbl+" INNER JOIN "+
    "alert_type_master as atm ON atm.id = "+userTbl+".alert_type_id INNER JOIN "+
    "alert_type_sub_master as atsm ON atsm.id = "+userTbl+".alert_type_sub_id"+
    " WHERE "+userTbl+".user_id = '"+userId+"' AND "+userTbl+".notification_status = 1";
	return sql.execute(query);
};


Alerts.setAlertOnOff = (status,id) => {
    const query = "UPDATE "+userTbl+" SET notification_status = "+status+" WHERE user_id = "+id;
    return sql.execute(query);
}
/*User.insertUser = ({username,mobile,otp,email,password}) => {
    return sql.execute("INSERT INTO "+userTbl+" (username,mobile,email,otp,password) VALUES (?,?,?,?,?)",[username,mobile,email,otp,password]);
};
User.signup = ({mobile,otp}) => {
    return sql.execute("INSERT INTO "+userTbl+" (mobile,otp) VALUES (?,?)",[mobile,otp]);
};
User.updateOtp = ({mobile,otp}) => {
    const query = "UPDATE "+userTbl+" SET otp = "+otp+" WHERE mobile = "+mobile;
    return sql.execute(query);
};
User.checkUser = ({mobile}) => {
    const query = "SELECT * FROM "+userTbl+" WHERE mobile = '"+mobile+"'";
    return sql.execute(query);
};
User.updateUser = ({username,email,password,mobile}) => {
    const query = "UPDATE "+userTbl+" SET username = '"+username+"',email = '"+email+"',password = '"+password+"' WHERE mobile = "+mobile;
    return sql.execute(query);
}; */
module.exports = Alerts;