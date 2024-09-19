import DataSummaries from "@/components/shared/DataSummaries";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  return (
    <>
      <section className="home mt-10">
        <h1 className="text-5xl text-center font-bold text-gray-600">All your information in one place</h1>
      </section>

      <section className="sm:mt-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="col-span-1 bg-gray-200 rounded-lg h-40">
            <div className="title-card  p-4">
              <h2 className="p-14-large pb-2">Nights Occupied:</h2>
              <p className="h2-bold">28 </p>
            </div>
          </div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-40">
            <div className="title-card  p-4">
              <h2 className="p-14-large pb-2">Occupancy Rate:</h2>
              <p className="h2-bold">76% </p>
            </div>
          </div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-40">
            <div className="title-card  p-4">
              <h2 className="p-14-large pb-2">Net Rent:</h2>
              <p className="h2-bold">$2494</p>
            </div>
          </div>
          <div className="col-span-1 bg-gray-200 rounded-lg h-40">
            <div className="title-card  p-4">
              <h2 className="p-14-large pb-2">Expenses:</h2>
              <p className="h2-bold">$1301</p>
            </div>
          </div>
          <DataSummaries/>
        </div>
      </section>
    </>
  );
};

export default Home;
