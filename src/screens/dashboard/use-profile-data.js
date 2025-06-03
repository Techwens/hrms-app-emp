/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import useAPIHandler from "../../hook/use-api-handler.js";

const useMyProfileService = () => {
  const { fetchData } = useAPIHandler();
  const [profileData, setProfileData] = useState({});
  const [loadingAboutSec, setLoadingAboutSec] = useState(false);

  const fetchEmpProfiledata = async () => {
    setLoadingAboutSec(true);
    // const employeeId = localStorage.getItem("hrms_employee_id");
    try {
      const url = `/employees/employee/2`;
      // const url = `/employee-portal/job-description`
      console.log("hello");
      const response = await fetchData({
        url: url,
        method: "GET",
      });

      console.log(response, "profile-response");
      setProfileData(response?.data);
      setLoadingAboutSec(false);
    } catch (error) {
      console.log(error, "profile-response-error");
      setLoadingAboutSec(false);
    }
  };
  useEffect(() => {
    fetchEmpProfiledata();
  }, []);
  return {
    profileData,
    loadingAboutSec,
  };
};

export default useMyProfileService;
