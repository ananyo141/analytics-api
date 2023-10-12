import { Button } from "@tremor/react";
import { toast } from "react-toastify";
import React from "react";

import { API_BASE_URL } from "@/constants";
import genRandomUserid from "@/utils/genRandomUserid";

type Props = {
  className?: string;
};

const ApiHitButton = ({ className }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const hitApi = async () => {
    setLoading(true);
    const userid = genRandomUserid();
    try {
      const res = await fetch(
        API_BASE_URL + `/hello/${userid}/?limit=${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache", // disable cache
        },
      );
      if (!res.ok) toast.error(`User ${userid}: API Failure`);
      else toast.success(`User ${userid}: API Success`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className={className} loading={loading} onClick={hitApi}>
      Hit API
    </Button>
  );
};

export default ApiHitButton;
