import Hero from '@/components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';


const HomePage = () => {
  
  // console.log(process.env.MONGODB_URI); here we can check that our db is connected or not.
  return (
    <>
      <Hero />
      <InfoBoxes/>
      <HomeProperties/>
    </>
  );
};

export default HomePage;
