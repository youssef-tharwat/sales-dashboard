import moment from "moment";

const timeStampToDate = timeStamp => {
  return moment(new Date(timeStamp)).format("YYYY-MM-DD");
};

export default timeStampToDate;
