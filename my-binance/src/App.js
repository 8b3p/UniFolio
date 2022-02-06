import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Main from './components/main/Main';
import Details from './components/details/Details';
import Footer from './components/footer/Footer';


function App() {
  return (
    <div className='App'>
      <Main />
      <div class="spacer layer1"></div>
      <Details>
        <div class="spacer layer2"></div>
      </Details>
      <Footer />
    </div>
  );
}

export default App;
