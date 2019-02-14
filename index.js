const {ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const request = require('request');
const {SEDataSource} = require('./sources/base');
const MeDataSource = require('./sources/users');
const R = require('ramda');

const app = express();

const APP_KEY = 'UtCg7EvWMG)kYVO*HiHNhw((';

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  
  interface Post {
      body: String!
      body_markdown: String!
      comment_count: Int!
      comments: [Comment!]
      creation_date: String!
      down_vote_count: Int!
      downvoted: Boolean!
      last_activity_date: String!
      last_edit_date: String
      last_editor: ShallowUser
      link: String!
      owner: ShallowUser
      post_id: Int!
      post_type: PostType!
      share_link: String!
      title: String!
      up_vote_count: Int!
      upvoted: Boolean!
  }
  
  enum PostType {
      answer,
      question
  }
  
  enum BadgeType {
      named,
      tag_based
  }
  
  enum RankType {
      gold,
      silver, 
      bronze
  }
  
  type Badge {
      award_count: Int!
      badge_id: Int!
      badge_type: BadgeType!
      description: String!
      link: String!
      name: String!
      rank: RankType!
      user: ShallowUser
  }
  
  type Comment {
      body: String!
      body_markdown: String!
      can_flag: Boolean!
      comment_id: Int!
      creation_date: String!
      edited: Boolean!
      link: String!
      owner: ShallowUser
      post_id: Int!
      post_type: PostType!
      reply_to_user: ShallowUser
      score: Int!
      upvoted: Boolean!
  }
  
  type BadgeCount {
      bronze: Int!
      silver: Int!
      gold: Int!
  }
  
  enum UserType {
      unregistered
      registered
      moderator
      team_admin
      does_not_exist
  }

  type ShallowUser {
      accept_rate: Int
      badge_counts: BadgeCount!
      display_name: String
      link: String
      profile_image: String
      reputation: Int
      user_id: Int
      user_type: UserType!
  }


  type Answer implements Post {
      post_id: Int!
      post_type: PostType!
      accepted: Boolean!
      answer_id: Int!
      awarded_bounty_amount: Int!
      awarded_bounty_users: [ShallowUser!]
      body: String!
      body_markdown: String!
      comment_count: Int!
      comments: [Comment!]
      can_flag: Boolean!
      community_owned_date: String
      creation_date: String!
      down_vote_count: Int!
      downvoted: Boolean!
      is_accepted: Boolean!
      last_activity_date: String!
      last_edit_date: String
      last_editor: ShallowUser!
      link: String!
      locked_date: String
      owner: ShallowUser
      question_id: Int!
      score: Int!
      share_link: String!
      tags: [String!]!
      title: String!
      up_vote_count: Int!
      upvoted: Boolean!
  }

  enum SiteState {
      normal,
      closed_beta,
      open_beta,
      linked_meta
  }

  enum SiteType {
      main_site
      meta_site
  }


  type Styling {
      link_color: String!
      tag_background_color: String!
      tag_foreground_color: String!
  }


  type Site {
      aliases: [String!]
      api_site_parameter: String!
      audience: String!
      closed_beta_date: String
      favicon_url: String!
      high_resolution_icon_url: String
      icon_url: String!
      launch_date: String!
      logo_url: String!
      markdown_extensions: [String!]
      name: String!
      open_beta_date: String
      related_sites: [RelatedSite!]
      site_state: SiteState!
      site_type: SiteType!
      site_url: String!
      styling: Styling!
      twitter_account: String!
  }

  type RelatedSite {
      api_site_parameter: String
      name: String!
      relation: String!
      site_url: String!
  }

  type MigrationInfo {
      on_date: String!
      other_site: Site!
      question_id: Int!
  }

  type Question implements Post {
      post_id: Int!
      post_type: PostType!
      accepted_answer_id: Int
      answer_count: Int!
      answers: [Answer!]
      body: String!
      body_markdown: String!
      bounty_amount: Int
      bounty_closes_date: String
      bounty_user: ShallowUser
      can_close: Boolean!
      can_flag: Boolean!
      close_vote_count: Int!
      closed_date: String
      closed_details: ClosedDetails
      closed_reason: String
      comment_count: Int!
      comments: [Comment!]
      community_owned_date: String
      creation_date: String!
      delete_vote_count: Int!
      down_vote_count: Int!
      downvoted: Boolean!
      favorite_count: Int!
      favorited: Boolean!
      is_answered: Boolean!
      last_activity_date: String!
      last_edit_date: String
      last_editor: ShallowUser!
      link: String!
      locked_date: String
      migrated_from: MigrationInfo
      migrated_to: MigrationInfo
      notice: Notice!
      owner: ShallowUser
      protected_date: String
      question_id: Int!
      reopen_vote_count: Int!
      score: Int!
      share_link: String!
      tags: [String!]!
      title: String!
      up_vote_count: Int!
      upvoted: Boolean!
      view_count: Int!
  }

  type Notice {
      body: String!
      creation_date: String!
      owner_user_id: Int!
  }

  type ClosedDetails {
      by_users: [ShallowUser!]!
      description: String!
      on_hold: Boolean!
      original_questions: [OriginalQuestion!]
      reason: String!
  }

  type OriginalQuestion {
      accepted_answer_id: Int
      answer_count: Int!
      question_id: Int!
      title: String!

  }

  type Badges {
      items: [Badge!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }

  type Answers {
      items: [Answer!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }
  
  type Questions {
      items: [Question!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }
  
  type Posts {
      items: [Posts!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }
  
  type Comments {
      items: [Comments!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }
  
  type User {
      about_me: String
      accept_rate: Int
      account_id: Int!
      age: Int
      answer_count: Int!
      badge_counts: BadgeCount!
      creation_date: String!
      display_name: String!
  }
  
  type Users {
      items: [User!]!
      has_more: Boolean
      quota_max: Int!
      quota_remaining: Int!
  }
  
  enum FilterType {
      safe,
      unsafe,
      invalid
  }
  
  type Filter {
      filter: String!
      filterType: FilterType!
      included_field: [String!]!
  }
  
  type Filters {
      items: [Filter!]!
      has_more: Boolean!
      quota_max: Int!
      quota_remaining: Int!
  }

  # Comments in GraphQL are defined with the hash (#) symbol.

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
      answers(ids: [String!], site: String, sort: String, order: String): Answers!
      badges(ids: [String!], site: String!, page: Int, pagesize: Int, order: String, min: RankType, max: RankType): Badges
      questions(ids: [String!], site: String, sort: String, page: Int, pagesize: Int, order: String): Questions
      posts(ids: [String!], site: String, sort: String, page: Int, pagesize: Int, order: String): Posts
      comments(ids: [String!], site: String, sort: String, page: Int, pagesize: Int, order: String): Comments
      users(ids: [String!], site: String, sort: String, page: Int, pagesize: Int, order: String): Users
      me(site: String!): User!
  }
  
  type Mutation {
      createFilter(included: [String!], excluded: [String!], base: String, unsafe: Boolean = false): Filters!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    answers: (root, args, {dataSources}) => dataSources.answers.getAll(args),
    badges: (root, args, {dataSources}) => dataSources.badges.getAll(args),
    questions: (root, args, {dataSources}) => dataSources.questions.getAll(args),
    posts: (root, args, {dataSources}) => dataSources.posts.getAll(args),
    comments: (root, args, {dataSources}) => dataSources.comments.getAll(args),
    me: (root, args, {dataSources}) => dataSources.me.getMe(args),
    users: (root, args, {dataSources}) => dataSources.users.getAll(args)
  }
};

const sources = [
  'answers',
  'questions',
  'posts',
  'badges',
  'comments',
  'users'
];

let access = {};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    const dataSources = R.map(source => new SEDataSource(APP_KEY, source))(sources);
    return R.zipObj(
      [...sources, 'me'],
      [...dataSources, new MeDataSource(APP_KEY)]
    )
  },
  context: () => ({access_token: access.access_token})
});


const CLIENT_ID = '14215';
const CLIENT_SECRET = 'pCDzLjLHnUhFsSnC0g*weA((';
const SCOPE = 'private_info';
const REDIRECT_URI = 'http://localhost:4000/success/callback';

app.get('/authorize', (req, res) => {
  res.redirect(`https://stackoverflow.com/oauth?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`)
});

app.get('/success/callback', (req, res) => {
  const {code} = req.query;
  request.post({
    url: 'https://stackoverflow.com/oauth/access_token/json',
    form: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI
    }
  }, function (err, httpResponse, body) {
    if (!err) {
      access = JSON.parse(body);
      res.send({message: 'Boom! You\'re in we\'ll start making authenticated request from now on'})
    } else {
      res.sendStatus(500);
    }
  })
});


server.applyMiddleware({app});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
app.listen({port: 4000}, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
});
