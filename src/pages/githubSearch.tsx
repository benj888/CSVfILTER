import React, { useEffect, useState } from "react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  url: string;
}
interface RepositoryData {
  items: Repository[];
  total_count: number;
}

const GithubSearch = () => {
  const [repositories, setRepositories] = useState<RepositoryData>({
    items: [],
    total_count: 0,
  });
  const [query, setQuery] = useState("reactaa");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<string>("30");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${query}&param_page=${page}&per_page=${perPage}`,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Accept: "application/vnd.github+json",
            },
          }
        );
        const data = await response.json();

        setRepositories(data);
        // console.log(typeof data);
        // console.log(repositories);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, page, perPage]);

  const handlePage = (pageNumber: number) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(repositories.total_count / 30)
    ) {
      setPage(pageNumber);
    }
  };

  const handleScroll = (e: React.UIEvent) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;

    const bottom = scrollHeight - scrollTop <= clientHeight;

    if (
      bottom &&
      !loading &&
      page < Math.ceil(repositories.total_count / Number(perPage))
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="p-2 h-full overflow-auto" onScroll={handleScroll}>
      <div className="text-center text-2xl">Github Repo Search</div>
      <div className="flex gap-x-4">
        <div className="flex flex-col">
          <p>Serching</p>
          <input
            className="shadow-lg border w-60 rounded px-4 py-1"
            type="text"
            placeholder="Serching..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-col w-60">
          <p>Perpage</p>
          <input
            type="text"
            className="shadow-lg border rounded px-4 py-1"
            placeholder="Perpage"
            value={perPage}
            onChange={(e) => {
              setPerPage(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="border ">
          <table className="table-auto w-full  border  text-lg ">
            <thead className="p-2 sticky top-0 bg-[#eaf3fc]">
              <tr className="text-left">
                <th className="p-2">NAME</th>
                <th className="p-2">FULL NAME</th>
                <th className="p-2">URL</th>
              </tr>
            </thead>

            <tbody>
              {repositories.items && repositories.items.length > 0 ? (
                repositories.items.map((item, index) => (
                  <tr
                    className={`border ${
                      index % 2 === 0 ? "bg-gray-300" : "bg-white"
                    }`}
                    key={index}
                  >
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.full_name}</td>
                    <td className="p-2">{item.url}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>NaN</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`h-10 bg-white flex justify-between mt-4 sticky bottom-0 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <button onClick={() => handlePage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span className="text-lg">
          
          <input 
          className="shadow-lg border rounded px-4 py-1 w-16" type="text" 
          value= {page}
          onChange={(e)=>setPage(Number(e.target.value))}
          />
          
         /{Math.ceil(repositories.total_count / 30)}
        </span>

        <button
          onClick={() => handlePage(page + 1)}
          disabled={page === Math.ceil(repositories.total_count / 30)}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};
export default GithubSearch;
