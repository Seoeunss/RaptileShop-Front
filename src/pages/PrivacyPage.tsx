export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", lineHeight: 1.8, color: "#222" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 8 }}>개인정보 처리방침</h1>
            <p style={{ color: "#666", marginBottom: 32 }}>시행일: 2024년 1월 1일</p>

            <p style={{ marginBottom: 32 }}>
                렙타일몰(이하 "회사"라 합니다)은 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 따라
                이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
                수립·공개합니다.
            </p>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제1조 (수집하는 개인정보의 항목 및 수집 방법)</h2>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>① 수집 항목</p>
                <p style={{ marginBottom: 8 }}>회사는 회원가입, 서비스 이용, 고객상담 등을 위해 아래와 같은 개인정보를 수집합니다.</p>

                <p style={{ fontWeight: 600, marginBottom: 4 }}>가. 회원가입 시 (필수항목)</p>
                <ul style={{ paddingLeft: 24, marginBottom: 12 }}>
                    <li>이름, 아이디(이메일 주소), 비밀번호, 연락처(휴대전화번호)</li>
                </ul>

                <p style={{ fontWeight: 600, marginBottom: 4 }}>나. 서비스 이용 과정에서 자동으로 수집되는 항목</p>
                <ul style={{ paddingLeft: 24, marginBottom: 12 }}>
                    <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 주소, 결제 기록, 불량 이용 기록</li>
                </ul>

                <p style={{ fontWeight: 600, marginBottom: 4 }}>다. 결제 및 배송 서비스 이용 시 (필수항목)</p>
                <ul style={{ paddingLeft: 24, marginBottom: 12 }}>
                    <li>수령인 이름, 배송 주소, 연락처, 결제수단 정보(신용카드사명, 카드번호 일부)</li>
                </ul>

                <p style={{ fontWeight: 600, marginBottom: 8 }}>② 수집 방법</p>
                <ul style={{ paddingLeft: 24 }}>
                    <li>홈페이지 회원가입, 서비스 이용, 이벤트 응모 및 제휴사로부터의 제공</li>
                    <li>생성정보 수집 툴을 통한 자동 수집</li>
                </ul>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제2조 (개인정보의 수집 및 이용 목적)</h2>
                <p style={{ marginBottom: 8 }}>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        <strong>서비스 제공 및 계약 이행</strong>: 파충류 분양 매물 정보 제공, 구매계약 체결, 결제, 배송 서비스 제공,
                        콘텐츠 제공, 유전자 계산기 서비스 제공, 채팅 서비스 제공
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>회원 관리</strong>: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지와 비인가 사용 방지,
                        가입의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>신규 서비스 개발 및 마케팅·광고 활용</strong>: 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른
                        서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공, 광고성 정보 제공,
                        접속빈도 파악, 회원의 서비스 이용에 대한 통계
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제3조 (개인정보의 보유 및 이용 기간)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 16 }}>
                        회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                        개인정보를 처리·보유합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                            <li style={{ marginBottom: 6 }}>
                                <strong>회원정보</strong>: 회원 탈퇴 시까지. 단, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
                            </li>
                            <li style={{ marginBottom: 6 }}>
                                <strong>전자상거래법에 따른 보존 기간</strong>:
                                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                                    <li>계약 또는 청약철회에 관한 기록: 5년</li>
                                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                                    <li>표시·광고에 관한 기록: 6개월</li>
                                </ul>
                            </li>
                            <li style={{ marginBottom: 6 }}>
                                <strong>통신비밀보호법에 따른 보존 기간</strong>:
                                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                                    <li>로그기록 자료: 3개월</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제4조 (개인정보의 제3자 제공)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        회사는 이용자의 개인정보를 제2조(개인정보의 수집 및 이용 목적)에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는
                        동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        다음의 경우에는 예외로 합니다.
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                            <li>이용자가 사전에 동의한 경우</li>
                            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                            <li>서비스의 제공에 따른 요금정산을 위하여 필요한 경우</li>
                        </ul>
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        거래 성사 시 판매자와 구매자 간의 원활한 거래를 위해 필요한 최소한의 정보(이름, 연락처, 배송주소)를 거래 당사자에게
                        제공할 수 있으며, 이용자는 서비스 이용 시 이에 동의한 것으로 간주합니다.
                    </li>
                </ol>

                <p style={{ fontWeight: 600, marginBottom: 8, marginTop: 16 }}>개인정보 처리 위탁</p>
                <p style={{ marginBottom: 8 }}>
                    회사는 서비스 이행을 위해 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                            <th style={{ border: "1px solid #ddd", padding: "8px 12px", textAlign: "left" }}>수탁업체</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px 12px", textAlign: "left" }}>위탁 업무 내용</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px 12px", textAlign: "left" }}>보유 및 이용 기간</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>결제대행사 (PG사)</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>신용카드 결제 처리 및 전자결제 대행</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>거래 완료 후 5년 또는 법령상 보존기간</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>택배사</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>상품 배송</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>배송 완료 후 즉시 파기</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>클라우드 서비스 제공업체</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>서버 및 인프라 운영</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>서비스 계약 기간 동안</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제5조 (개인정보의 파기)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        이용자로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를
                        계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        개인정보 파기의 절차 및 방법은 다음과 같습니다.
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                            <li style={{ marginBottom: 6 }}>
                                <strong>파기절차</strong>: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
                            </li>
                            <li>
                                <strong>파기방법</strong>: 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 기술적 방법을 사용하여 삭제하며,
                                종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                            </li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제6조 (이용자 및 법정대리인의 권리·의무 및 그 행사방법)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을
                        통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우
                        「개인정보 보호법 시행규칙」 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
                    </li>
                    <li>
                        회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한
                        대리인인지를 확인합니다.
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제7조 (개인정보의 안전성 확보 조치)</h2>
                <p style={{ marginBottom: 8 }}>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        <strong>관리적 조치</strong>: 내부관리계획 수립·시행, 개인정보 취급 직원의 최소화 및 교육
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>기술적 조치</strong>: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화,
                        보안프로그램 설치
                    </li>
                    <li>
                        <strong>물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제8조 (쿠키(Cookie)의 설치·운영 및 거부)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의
                        PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를
                        허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                    </li>
                    <li>
                        쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제9조 (개인정보 보호책임자)</h2>
                <p style={{ marginBottom: 12 }}>
                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
                    아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: 6, padding: "16px 20px" }}>
                    <p style={{ margin: 0, marginBottom: 6 }}><strong>개인정보 보호책임자</strong></p>
                    <p style={{ margin: 0, marginBottom: 4 }}>성명: 렙타일몰 개인정보보호 담당자</p>
                    <p style={{ margin: 0, marginBottom: 4 }}>이메일: privacy@reptilemall.co.kr</p>
                    <p style={{ margin: 0 }}>전화번호: 고객센터를 통해 문의 바랍니다</p>
                </div>
                <p style={{ marginTop: 12 }}>
                    정보주체께서는 회사의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한
                    사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
                </p>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제10조 (개인정보 처리방침의 변경)</h2>
                <ol style={{ paddingLeft: 20 }}>
                    <li style={{ marginBottom: 8 }}>
                        이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의
                        시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                    </li>
                </ol>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "2px solid #333", paddingBottom: 6, marginBottom: 16 }}>제11조 (권익침해 구제방법)</h2>
                <p style={{ marginBottom: 8 }}>
                    정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
                    분쟁해결이나 상담 등을 신청할 수 있습니다.
                </p>
                <ul style={{ paddingLeft: 24 }}>
                    <li style={{ marginBottom: 6 }}>
                        <strong>개인정보분쟁조정위원회</strong>: (국번없이) 1833-6972 (www.kopico.go.kr)
                    </li>
                    <li style={{ marginBottom: 6 }}>
                        <strong>개인정보침해신고센터</strong>: (국번없이) 118 (privacy.kisa.or.kr)
                    </li>
                    <li style={{ marginBottom: 6 }}>
                        <strong>대검찰청 사이버수사과</strong>: (국번없이) 1301 (www.spo.go.kr)
                    </li>
                    <li>
                        <strong>경찰청 사이버안전국</strong>: (국번없이) 182 (cyberbureau.police.go.kr)
                    </li>
                </ul>
            </section>

            <p style={{ marginTop: 40, color: "#666", fontSize: "0.9rem" }}>
                본 개인정보 처리방침은 「개인정보 보호법」 및 관련 법령, 개인정보보호위원회의 표준 개인정보 처리방침 작성지침(2025.4.21.)을 준수하여 작성되었습니다.
            </p>
        </div>
    );
}
