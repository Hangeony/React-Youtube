import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscribe(props) {
  //video 업로드 한사람이 얼마나 구독자 수를 가져와야함
  //videoDetailpage에서 VideoDetail.writer._id를 props로 넣어주면 된다.
  let variable = { userTo: props.userTo };

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        //subscribeNumber =subscribe.js에서 불러온것.
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 받아오지 못 했습니다.");
      }
    });
    //localStorage에서 userId를 가져올수 있게 해뒀음.
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    axios
      .post("/api/subscribe/subscribed", subscribedVariable)
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("정보를 받아오지 못 했습니다.");
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubscribe = () => {
    //usrFrom은 localStorage에서 userId를 가져올수 있게 해뒀음.
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    //이미 구독중일 경우
    if (Subscribed) {
      axios
        .post("/api/subscribe/unSubscribe", subscribedVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소 하는데 실패 했습니다.");
          }
        });
      //아직 구독을 안했을때
    } else {
      axios
        .post("/api/subscribe/subscribe", subscribedVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 하는데 실패 했습니다.");
          }
        });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#AAA" : "#C00"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px, 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
