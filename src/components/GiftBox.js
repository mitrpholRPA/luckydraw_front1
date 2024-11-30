import React from 'react';
import './GiftBox.css'; // ไฟล์ CSS สำหรับจัดการ style

const GiftBox = ({isDraw,isRecive,displayPrize}) => {
  return (
    <div className="gift-container-wrapper">
        <div className="gift-container">
            {/* ฝากล่อง */}
            <div className="gift-lid">
                <img src={`${process.env.PUBLIC_URL}/images/Box-Lid.png`} alt="Gift Lid" />
            </div>
            
            {isDraw ? (
                isRecive ?(
                    <div className="gift-text">
                        <h2>{displayPrize}</h2>
                    </div>
                ):(
                    <>
                    <div className="gift-text">  คุณไม่ได้รับรางวัลหน้างาน </div>
                    <div className="gift-text-bold">  รอลุ้นรางวัลใหญ่ในงาน </div>
                    </>
                )
            
            ):(
                <div className="gift-text">
                    <h2>{displayPrize}</h2>
                </div>
            )
        }




            {/* กล่องของขวัญ */}
            <div className="gift-box">
                <img src={`${process.env.PUBLIC_URL}/images/Box.png`} alt="Gift Box" />
            </div>

        </div>
    </div>
  );
};

export default GiftBox;
