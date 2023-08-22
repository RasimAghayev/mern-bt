const express = require("express");
const request = require("request");
const { check, validationResult } = require("express-validator");

// Middleware
const auth = require("../../middleware/auth");

// Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { config } = require("process");

// Router
const router = express.Router();

// @router  GET     api/profile/me
// @desc    Get current users profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile)
      return res.status(400).json({ msg: "There is no profile this user" });

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @router  POST     api/profile
// @desc    Register new user
// @access  Private

router.post(
  "/",
  [
    auth,
    check("status", "Status is required.").not().isEmpty(),
    check("skills", "Skills is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    // if (ok) profileFields.social.ok = ok;
    // if (vk) profileFields.social.vk = vk;

    try {
      // See if user exists
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: { ...profileFields } },
          { new: true }
        );

        return res.json(profile);
      }

      // Create a new profile for the current user
      profile = new Profile(profileFields);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @router  GET     api/profile
// @desc    Get all users profile
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) return res.status(400).json({ msg: "There is no profiles" });

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @router  GET     api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "There is no profile this user" });

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid User Id" });
    }
    res.status(500).send("Server error");
  }
});

// @router  DELETE     api/profile
// @desc    Delete profile, user & posts
// @access  Private

router.delete("/", async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid User Id" });
    }
    res.status(500).send("Server error");
  }
});

// @router  PUT     api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required.").not().isEmpty(),
    check("company", "Company is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @router  DELETE     api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid User Id" });
    }
    res.status(500).send("Server error");
  }
});

// @router  PUT     api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required.").not().isEmpty(),
    check("company", "Company is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @router  DELETE     api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid User Id" });
    }
    res.status(500).send("Server error");
  }
});

// @router  PUT     api/profile/education
// @desc    Add profile education
// @access  Private

router.put(
  "/education",
  [
    auth,
    check("school", "School is required.").not().isEmpty(),
    check("degree", "Degree is required.").not().isEmpty(),
    check("fieldofstudy", "Field of study is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @router  DELETE     api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove Index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Invalid User Id" });
    }
    res.status(500).send("Server error");
  }
});

// @router  GET     api/profile/github/:username
// @desc    Get user repos from GitHub
// @access  Public

router.delete("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "gitClientId"
      )}&client_secret=${config.get("gitCleantSecret")}`,
      method: "GET",
      headers: {
        "user-agent": "node.js",
      },
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: "No GitHub profile found." });
      }
      res.json(body);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
