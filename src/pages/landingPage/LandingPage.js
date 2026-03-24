import StandardHeader from '../../components/headers/standardHeader/StandardHeader';
import styles from './landingPage.module.scss';
import SignUpButton from '../../components/buttons/signUpButton/SignUpButton';
import LogInButton from '../../components/buttons/logInButton/LogInButton';

export default function LandingPage() {
  return (
    <div className={styles["landing-page-container"]}>
        <StandardHeader>
          <LogInButton />
          <SignUpButton />
        </StandardHeader>
        <main className={styles["landing-page-content"]}>
            <h2>Bem-vindo ao mundo Pokémon!</h2>
            <p>Escolha seu parceiro e comece sua jornada!</p>
        </main>
    </div>
  );
}