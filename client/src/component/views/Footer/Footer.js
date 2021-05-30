import React from "react";
import "./Sections/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="grid-container">
        <div className="grid-row footer-custom">
          <div className="mrtFooter">
            <div className="footer-container1">
              <div className="customer">
                <h5 className="customer-subject">고객센터 운영안내</h5>
                <p className="customer-question">
                  <span className="customer-word"> 평일(채팅/유선) : </span>
                  09:00 ~ 18:00 (12시~13시 제외)
                  <br />
                  <span className="customer-word"> 주말/ 공휴일 : </span>
                  채팅 상담만 가능
                  <br />
                  <span className="customer-word">※ 영상디버깅오류 :</span>
                  09:00 ~ 17:00까지 접수 가능
                  <br />
                  <span className="customer-word">유선 상담 : </span>
                  1670-8208
                </p>
                <button className="chat-btn">1:1 채팅상담</button>
              </div>
            </div>
            <div className="footer-container2">
              <p className="footer-copyright">
                팀명 (주)HappyTube | 팀장 오민섭 | 메인 프론트 한건희 | 사업자
                등록번호 123-45-67891
                <br />
                주소 서울특별시 *********** | email g@naver.com | 마켓팅/제휴
                문의 g@naver.com
                <br />
                <br />
                자사는 서울특별시관광협회 공제영업보증보험에 가입되어 있지
                않습니다. 해피튜브는 통신 판매중개자이며 통신판매의 당사자가
                아닙니다. 따라서 상품 거래정보 및 거래에 대하여 책임을 지지
                않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
