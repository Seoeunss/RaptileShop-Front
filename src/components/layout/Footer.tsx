import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="appFooter">
            <div className="appFooterInner">
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 6 }}>
                    <Link to="/terms" style={{ color: "inherit", textDecoration: "underline", fontSize: "0.85rem" }}>이용약관</Link>
                    <Link to="/privacy" style={{ color: "inherit", textDecoration: "underline", fontSize: "0.85rem", fontWeight: 700 }}>개인정보 처리방침</Link>
                </div>
                © Reptile Platform
            </div>
        </footer>
    );
}
