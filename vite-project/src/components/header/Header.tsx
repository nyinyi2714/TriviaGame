import "./Header.css";

function Header(props: { header: string; backBtn?: () => void}) {
  const { header } = props;
  return (
    <div className="container-header">
      <div className="title">{header}</div>
      <div className="back-btn-box">
        <button className="back-btn">
          <img src="https://img.icons8.com/ios/50/000000/back--v1.png" alt="back" onClick={props.backBtn} />


          



        </button>
      </div>
    </div>
  );
}

export default Header;
