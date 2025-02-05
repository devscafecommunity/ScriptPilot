/*
const searchTerm = 'your_search_term'; // Replace with your actual search term
const apiUrl = `https://api.github.com/search/repositories?q=${searchTerm}`;

Some useful information about the GitHub repository search:

1. **Using GitHub Website:**

   - Go to the GitHub website (https://github.com).
   - In the search bar at the top of the page, type in keywords related to the repository you're looking for.
   - You can filter your search using the "Repositories" tab to specifically search for repositories.
   - As you type, GitHub will suggest repositories and users that match your search criteria.

2. **Using GitHub Search Operators:**

   GitHub's search feature supports various search operators to refine your search. Here are some commonly used ones:

   - `user:username` - Search for repositories owned by a specific user.
   - `org:organization` - Search for repositories owned by a specific organization.
   - `repo:repository-name` - Search for a specific repository by its name.
   - `language:programming-language` - Search for repositories that use a specific programming language.
   - `stars:>n` - Search for repositories with more than `n` stars.
   - `forks:>n` - Search for repositories with more than `n` forks.

   You can combine these operators to create more complex searches. For example:
   
   - `user:username language:python stars:>100` - Search for repositories owned by "username" that are written in Python and have 
   more than 100 stars.

3. **Advanced Search:**

   If you need more advanced search capabilities, you can use GitHub's advanced search page (https://github.com/search/advanced). 
   Here you can specify multiple criteria to narrow down your search.

4. **Using the GitHub API:**

   If you're looking to automate the search process or integrate GitHub search into your applications, you can use the GitHub API. 
   The API allows you to programmatically interact with GitHub's data. You can find more information about the GitHub API in their 
   documentation.

Remember that while searching for public repositories is straightforward, searching for private repositories would require proper 
authentication and authorization.



RESPONSE:

{
  "total_count": 14378,
  "incomplete_results": false,
  "items": [
    {
      "id": 40484398,
      "node_id": "MDEwOlJlcG9zaXRvcnk0MDQ4NDM5OA==",
      "name": "discord.js",
      "full_name": "discordjs/discord.js",
      "private": false,
      "owner": {
            "login": "discordjs",
            "id": 26492485,
            "node_id": "MDEyOk9yZ2FuaXphdGlvbjI2NDkyNDg1",
            "avatar_url": "https://avatars.githubusercontent.com/u/26492485?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/discordjs",
            "html_url": "https://github.com/discordjs",
            "followers_url": "https://api.github.com/users/discordjs/followers",
            "following_url": "https://api.github.com/users/discordjs/following{/other_user}",
            "gists_url": "https://api.github.com/users/discordjs/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/discordjs/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/discordjs/subscriptions",
            "organizations_url": "https://api.github.com/users/discordjs/orgs",
            "repos_url": "https://api.github.com/users/discordjs/repos",
            "events_url": "https://api.github.com/users/discordjs/events{/privacy}",
            "received_events_url": "https://api.github.com/users/discordjs/received_events",
            "type": "Organization",
            "site_admin": false
        },
    },
    ...
    ]
}

*/ 

async function reposearch(queryTerm){
    const apiUrl = `https://api.github.com/search/repositories?q=${queryTerm}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    let returnData = {
        total_count: data.total_count,
        incomplete_results: data.incomplete_results,
        items: []
    }

    for(let i = 0; i < 3; i++){
        returnData.items.push(data.items[i]);
    }

    return returnData;
}

module.exports = reposearch;