import styles from './standardHeader.module.scss';
import aipomLogo from '../../../assets/images/aipomLogo.png';
import aipomTitle from '../../../assets/images/aipomDex.png';

export default function StandardHeader({ children }) {
    return (
        <header className={styles["app-bar"]}>
            <div className={styles["app-bar-background"]}></div>
            <img className={styles["app-bar-site-icon"]} src={aipomLogo}/>
            <img className={styles["app-bar-site-title"]} src={aipomTitle}/>
            <nav className={styles["app-bar-buttons"]}>
                { children }
            </nav>
        </header>
    );
}