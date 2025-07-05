import { useState, useEffect } from "react";
import Axios from "axios";
import formatDistance from "date-fns/formatDistanceToNow";

import desktopImg from "./assets/hero-image-github-profile.jpg";
import searchIcon from "./assets/Search.svg";
import forkIcon from "./assets/Nesting.svg";
import starIcon from "./assets/Star.svg";

const Page = () => {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState("");
  const [fetch, setFetch] = useState(false);

  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchSuggests, setSearchSuggests] = useState([]);

  const URL = "https://api.github.com/users";
  const URL1 = `https://api.github.com/users/${selected}`;
  const [reposURL, setReposURL] = useState("");

  const fetchUsers = async () => {
    let allUsers = [];
    let page = 1;

    try {
      while (true) {
        const res = await Axios.get(`${URL}?per_page=100&page=${page}`, {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        });
        if (allUsers.length === 100) break;
        if (res.data.length === 0) break;
        allUsers = [...allUsers, ...res.data];
        page++;
      }
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await Axios.get(URL1);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchrepos = async () => {
    try {
      const res = await Axios.get(reposURL);
      setRepos(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchAndFilterUsers = async () => {
      if (username.length > 0) {
        await fetchUsers();
        setSearchSuggests(
          users.filter((user) => user.login.includes(username))
        );
      }
      if (selected !== "") {
        fetchUser();
        fetchrepos();
      }
    };

    fetchAndFilterUsers();
    console.log(users);
  }, [username, selected]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFetch(true);
    setSelected(username);
    setReposURL(`https://api.github.com/users/${username}/repos`);
  };

  return (
    <div className="relative max-w-screen text-[#CDD5E0]">
      <img
        src={desktopImg}
        alt="Cover-image"
        className="w-full h-[15rem] object-cover"
      />
      <div className="absolute top-0 left-[50%] transform -translate-x-[50%] w-[80%] h-full flex flex-col">
        <div className="bg-[#364153] shadow-md absolute z-20 w-[90%] sm:w-[60%] md:w-[80%] h-auto top-12 left-[50%] transform -translate-x-[50%] rounded-2xl py-2">
          <form
            onSubmit={handleSearch}
            className="w-full h-16 flex justify-center items-center"
          >
            <button type="submit">
              <img
                src={searchIcon}
                alt="Search"
                className="mx-3 w-auto h-auto"
              />
            </button>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username"
              className="w-[90%] border-black bg-transparent focus:outline-none"
            />
          </form>

          {/* Search suggestion */}
          <div
            className={
              username.length > 0 && searchSuggests.length > 0
                ? "bg-[#364153] overflow-auto w-auto max-h-[600px] flex flex-col content-start mx-4 shadow-md"
                : "hidden"
            }
          >
            {searchSuggests.map((suggests) => (
              <li
                key={suggests.id}
                onClick={() => {
                  setSelected(suggests.login);
                  setReposURL(suggests.repos_url);
                  setUsername("");
                  setFetch(true);
                }}
                className="w-full h-auto border-t border-[#97a3b6] flex justify-start items-center gap-2 py-2 px-2 cursor-pointer hover:scale-95 transition duration-300"
              >
                <img
                  src={suggests.avatar_url}
                  alt="Profile-picture"
                  className="w-12 h-w-12 rounded-full"
                />
                <div className="border-l font-semibold px-2">
                  {suggests.login}
                </div>
              </li>
            ))}
          </div>
        </div>

        {/* User profile */}
        <div
          className={
            fetch ? "w-full h-40 mt-44 flex items-end gap-10" : "hidden"
          }
        >
          <img
            src={user.avatar_url}
            alt="Profile"
            width={100}
            height={100}
            className="w-48 h-full border-[#364153] border-8 rounded-2xl mr-10"
          />
          <div className="w-auto h-[30%] flex justify-around gap-3 items-center px-3 bg-[#111729] rounded-xl text-lg">
            <strong>Followers</strong>
            <div className="border-l border-l-[#97A3B6] h-[70%]"></div>
            <strong>{user.followers}</strong>
          </div>
          <div className="w-auto h-[30%] flex justify-around gap-3 items-center px-3 bg-[#111729] rounded-xl text-lg">
            <strong>Following</strong>
            <div className="border-l border-l-[#97A3B6] h-[70%]"></div>
            <strong>{user.following}</strong>
          </div>
          <div
            className={
              user.location == null
                ? "hidden"
                : "w-auto h-[30%] flex justify-around gap-3 items-center px-3 bg-[#111729] rounded-xl text-lg"
            }
          >
            <strong>Location</strong>
            <div className="border-l border-l-[#97A3B6] h-[70%]"></div>
            <strong>{user.location}</strong>
          </div>
        </div>
        <div className={fetch ? "pt-4 w-[50%] h-auto mb-20" : "hidden"}>
          <h1 className="text-5xl font-extrabold mb-2">{user.name}</h1>
        </div>

        {/* User repo */}
        <div
          className={
            fetch
              ? "w-full h-auto grid lg:grid-cols-2 gap-8 mb-10 cursor-pointer"
              : "hidden"
          }
        >
          {Array.isArray(repos) &&
            repos.map((repo) => (
              <li
                key={repo.id}
                onClick={() => {
                  window.location.href = repo.html_url;
                }}
                className="bg-[#1D1B48] h-auto flex flex-col p-4 rounded-3xl md:rounded-xl"
              >
                <div className="flex flex-col gap-3">
                  <strong className="font-extrabold text-2xl">
                    {repo.name}
                  </strong>
                  <div>
                    <strong>Visibility: </strong>
                    {repo.visibility}
                  </div>
                  <div className="w-full h-auto flex justify-start gap-3">
                    <div className="w-auto h-full flex items-center gap-1">
                      <img src={forkIcon} alt="" />
                      {repo.forks_count}
                    </div>
                    <div className="w-auto h-full flex items-center gap-1">
                      <img src={starIcon} alt="" />
                      {repo.stargazers_count}
                    </div>
                    <div className="w-auto h-full flex items-center gap-1">
                      {formatDistance(new Date(repo.created_at), new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
