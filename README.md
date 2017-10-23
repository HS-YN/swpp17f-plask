# Project Requirements and Specification
### Location-based live Q&A platform “Plask”

#### Team 6
Choi Jae hyeok (2012-12666, Dept. of Physics Education)
Park Jiyeon (2014-18200, College of Liberal Studies)
Seo Seong Hoon (2015-19410, College of Liberal Studies)
Yun Heeseung (2015-16890, College of Liberal Studies)

#### Document Revision History
`Rev 1.0 2017-10-23 - Initial Version`

## Project Abstract

"Plask" is a real-time/live Q&A platform for location-based(“localized”) questions. Using Plask, users can easily ask location-specific questions to other users who have the answers to their questions, i.e. to users who actually are in that place.

Despite the fact that we live in the age of information, there are still some information that you just can't satisfiably get by searching web browsers. This is especially the case for location-based questions. Think of a scenario where you want to know if a road is blocked due to construction, or if a specific coffee shop currently has empty seats. Search engines simply do not have those information for the users. Even if they do, there is still a very high chance that the information is not “live” or up-to-date, being valueless for the users.

Now, what if you could ask those same questions to people living or staying in that place? With high chance, you would quickly get the needed information that is valid at that moment. In short, location-based questions can easily and quickly be addressed through collective intelligence of users living in that specific location.


## Customers

Anyone who has questions bound to a specific location can be our user!
In practice, users who frequently move from places to places (could be for travel or business) would be our primary users, along with "local experts" who will actively contribute to the collective intelligence by answering those questions.

We have listed some of the many scenarios where Plask will come in very handy for people.

1. If you were a traveler in London wanting to know if there is a local festival today,
    a. Without Plask: You would have to search “Local festivals in London” and read through several posts about local festivals and check one festival after another if there is one that actually holds place today.
    b. With Plask: You could Plask “Is there a local festival in London today?” and any Londoner, or even a knowledgeable traveler, will quickly answer your question. 

2. If you were a student looking for a cafe with electrical outlets,
    a. Without Plask: You would have to go in and out of one cafe after another until you find one with electrical outlets.
    b. With Plask: You could Plask “Is there a cafe with electrical outlets in Nakseongdae?” and a local user who frequently goes to cafe will quickly answer your question.

## Competitive Landscape

#### <Services that provide a General Q&A Platform>

1. Naver Jisik-iN (http://kin.naver.com/index.nhn)
Jisik-iN is a Q&A platform for all types of questions.
Major Features:
     1) Questions are categorized by topics and can be tagged with keywords.
     2) Users can ask questions to experts such as doctors, lawyers, and accountants.
     3) Users are given points for asking and answering questions.

#### <Services that provide location-based Information>

1. Yelp (https://www.yelp.com/sf)
Yelp is a service with the purpose of "Connecting People with great local businesses."
Major Features:
    1) Users fill out “Find:( ) Near:( )” format to search for specific services 
         in a designated location.
    2) Users interact with each other by writing reviews about local businesses.
    3) Businesses can set up their own accounts to post information
        and communicate with users.

#### <Services that share the "location-based Q&A" functionality>
1.LocalMind (https://www.crunchbase.com/organization/localmind)
Major Features:
    1. Connection with existing check-in services (sign in, location pinpointing)
    2. Shows nearby users based on check-in services and can send questions to them.
    ex) Crescent Street - live localminds, one expert localmind available

2. Loqly (https://www.crunchbase.com/organization/loqly)
Major Features:
    1. local-based questions tied to specific businesses
        Search Keyword --> Show local businesses related 
                                    --> Ask questions about a particular business
        ex) Pasta --> Show list of Italian Restaurants 
                         --> Ask questions about a specific restaurant. 
    2. General Recommendations Q&A

3. CrowdBeacon (https://www.crunchbase.com/organization/crowdbeacon)
"Crowdbeacon was a location-based service helping users answers questions by directing them to local experts nearby."

#### <How Plask is Different from existing Services>
1. Convenience and Simplicity:
We believe that location-based questions are also very much bound to the time being asked. For instance, a recommendation for a coffee shop might change if some shops close on Mondays. Also, recommendation for public transportation might change depending on the time of the day. One might recommend bus during the day, but subway for the evening since many people get off work during the evening.

Also, many of the questions are not of significant importance to be stored. They are usually one-time questions that the asker does not need to keep hold of the information once the question is solved.

Thus, compared to other services we will minimize our user interface and functionality to focus on the Q&A and make the user experience as simple as possible.

2. Achieving Real-time through Active Tag System.
Minimizing the time delay between asking a question and receiving an answer is pivotal in this service. This is due to the fact that many questions are asked impromptu, yet requires an immediate addressing. For example, if one wants to know if a road is blocked due to a festival, he or she is probably already on the road and has to be informed quickly before deciding to make a turn or not.

Thus, our service aims real-time Q&A through Active Tag System. Instead of redirecting questions based on pure user-location, a user can actively tag him/herself with "location" tags and "service" tags that he or she is comfortable with answering (i.e. a "local expert"). Asker will also tag the question with location and service tags. Through this feature, we can efficiently redirect questions to users who have the same or closest, tags. This will increase the chance of a question being sent to users who actually can answer, thus increasing the chance of a question being answered. 
