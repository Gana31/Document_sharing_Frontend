import NewsLetterBox from "../../Component/NewsletterBox.jsx";
import Title from "../../Component/Title.jsx";
import assets from "../../assets/index.js";

const About = () => {
  return (
    <div className="mx-16">
      <div className="text-2xl text-center pt-8 border-t  ">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.bookHero}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
          We are a dedicated team committed to providing exceptional services and solutions tailored to meet the needs of our clients. With a focus on quality, innovation, and customer satisfaction, we strive to exceed expectations in everything we do.

          </p>
          <p>
          Our journey began with a simple mission: to make a positive impact in our industry by delivering reliable and effective solutions. Today, we continue to grow and innovate, ensuring that our clients receive the best possible service and support.

          </p>  
          <b className="text-gray-800 ">Our Mission</b>
          <p>
          Our mission is to empower individuals and businesses through our products and services. We aim to create value and foster growth by staying ahead of industry trends and focusing on our customers’ evolving needs.

          </p>
        </div>
      </div>
      <div className=" text-xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'} />

        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Quality Assurance </b>
            <p className="text-gary-600 ">
            Our team is dedicated to maintaining the highest standards of quality in every aspect of our work, ensuring reliable and consistent results.

            </p>
          </div>
          <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Convenience</b>
            <p className=" text-gary-600">
            We prioritize convenience, making our products and services accessible and easy to use, so you can focus on what matters most.

            </p>
          </div>
          <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Exeptional Customer Service </b>
            <p className=" text-gary-600">
            Our customer support team is here to assist you at every step, ensuring a smooth and enjoyable experience.

            </p>
          </div>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default About;