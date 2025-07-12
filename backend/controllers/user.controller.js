import User from "../models/user.model.js";

export const getUserProfileAndRepos=async(req,res)=>{
      const {username}=req.params

     try{
         const userRes = await fetch(
        `https://api.github.com/users/${username}`,{
          headers:{
            authorization:`token ${process.env.GITHUB_API_KEY}`,  
          }
        });
      const userProfile = await userRes.json();
      const repoRes = await fetch(userProfile.repos_url,{
        headers:{
           authorization:`token ${process.env.GITHUB_API_KEY}`,  
        }
      });
      const repos = await repoRes.json();    
        
      res.status(200).json({
         userProfile,
         repos
      }) 
     }
     catch(e){
        res.status(500).json({error:e.message})
     }

}

export const likeProfile = async (req, res) => {
	try {
		
		const { username } = req.params;             // in the parameters whom profile i want to like
		const userToLike = await User.findOne({ username });  // the user whom i want to like so fetching
		if (!userToLike) {
			return res.status(404).json({ error: "User is not a member" });
		}

    const user = await User.findById(req.user._id.toString());     //the Authenticated User
		console.log(user, "auth user");

		if (user.likedProfiles.includes(userToLike.username)) {      //Checks if the authenticated user has already liked this profile by checking if userToLike.username is in the likedProfiles array.
			return res.status(400).json({ error: "User already liked" });
		}

		userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
		user.likedProfiles.push(userToLike.username);

		// await userToLike.save();
		// await user.save();
		await Promise.all([userToLike.save(), user.save()]);

		res.status(200).json({ message: "User liked" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getLikes = async (req, res) => {
	try {
		const user = await User.findById(req.user._id.toString());
		res.status(200).json({ likedBy: user.likedBy });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

