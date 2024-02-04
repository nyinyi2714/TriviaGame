import "./Settings.css";
import { Header } from "../../components";

function Settings() {


  return (


    <><Header header="Settings" />

    <div className="container">
      <div className="settings-language">
        <button className="settingsBtn negative-btn">ENGLISH</button>
      </div>
      <div className="settings-color-blind">
        <button className="settingsBtn negative-btn">COLOR BLIND</button>
      </div>
      <div className="settings-audio-only">
        <button className="settingsBtn negative-btn">AUDIO ONLY</button>
      </div>
    </div>
  </>
  );
}

export default Settings;
