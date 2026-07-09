const getAppointments=(req,res)=>{
    res.send("ALL APPOINTEMENTS");
};

const bookAppointments=(req,res)=>{
    console.log(req.body);
    res.send("APPOINTEMENTS BOOKED SUCCESSFULLY");
};

module.exports={
    getAppointments,
    bookAppointments,
}
