import "./Header.css";

function Header(props) {
  const { header } = props;
  return (
    <div className="container-header">
      <div className="title">{header}</div>
      <div className="back-btn-box">
        <button className="back-btn">
          <img src="../assets/back.svg" alt="BACK BUTTON" id="backImg"></img>
        </button>
      </div>
    </div>
  );
}

export default Header;
