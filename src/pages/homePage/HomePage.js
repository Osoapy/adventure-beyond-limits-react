import LogInButton from '../../components/headerButtons/LogInButton';
import SignUpButton from '../../components/headerButtons/SignUp';
import StandardHeader from '../../components/standardHeader/StandardHeader';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="homepage-container">
      <StandardHeader>
        <SignUpButton></SignUpButton>
        <LogInButton></LogInButton>
      </StandardHeader>

      <main className="homepage-content">
        <h2>Bem-vindo ao mundo Pokémon!</h2>
        <p>Escolha seu parceiro e comece sua jornada!</p>
      </main>
    </div>
  );
}