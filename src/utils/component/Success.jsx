import { useLocation, useNavigate } from "react-router-dom";
import CommonAxios from "../common/CommonAxios";
import { Common } from "../common/Common";

const Success = () => {
  const navigate = useNavigate();
  // url 패스 설정에서 price 변수 가져오기
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const price = searchParams.get("price");

  const onClickSuccess = async () => {
    try {
      const accessToken = Common.getAccessToken();
      const memberDto = {
        point: price,
      };
      const multiDto = {
        accessToken: accessToken,
        memberDto: memberDto,
      };
      const res = await CommonAxios.postTokenAxios(
        "mypage",
        "savePoint",
        multiDto
      );
      console.log("금액 충전 : " + res.data);

      if (res.data === true) {
        alert("결제 성공");
        navigate("/mypage");
      } else {
        alert("결제 실패");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <button onClick={onClickSuccess}>결제 완료</button>
      </div>
    </>
  );
};

export default Success;
