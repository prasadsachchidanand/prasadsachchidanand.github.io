#import "template.typ": *
#let title = "Homework #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Engineering Mathematics-I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "Statements"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#instruction[
  We recall the statement and how ro write a statement using mathematical quantifiers. For example, consider the following statement
    #set quote(block: true)
    #quote()[
      #text(blue)[Every student of this class is from the computer science branch.] 
    ]
  We want to write the above statement using the quantifiers (_for all_ $forall$ and _there exists_ $exists$) and then we will write the negation. 

  Let 
  $
    cal(S) = "set of all students of this class".
  $
  Then we can write the above statement using quatifiers as 

  #quote()[
      #text(blue)[
        $forall s in cal(S) " " (s "is from the computer science branch.")$
      ] 
    ]

  The negation of the above statement will be as follows. 

  #quote()[
      #text(rgb("#CC00CC"))[
        There is a student of this class which is not from the computer science branch.
      ] 
    ]

  In terms of quantifiers, 

  #quote()[
      #text(rgb("#CC00CC"))[
        $exists " " s in cal(S)$ ($s$ is not from the computer science branch.)
      ] 
    ]

]

#prob[
  Write the negation of the following statements. 

  + $5$ is a prime number.

  + Moscow is the capital of China.

  + The literacy rate in India has increased since 1947.

  + The child is cute.

  + The market will not be open in the evening.

  + The square of the integer $n$ is divisible by the prime $p$.

  + $x^2 + 3 = 27$.
]

#prob[
  Identify the quantifiers. 

  + There is a rotten apple in the basket of apples. 

    #text(blue)[In this example, the quantifier is _there exists_, that is, $exists$.]

  + All students of SPNREC Araria are from Bihar. 

  + Every classroom has a smartboard. 

  + Every page in this book contains at least 500 words.

  + All tables in the room are dirty.

  + There exists a student in the classroom who is at least 6 feet tall.

  + In this book some pages do not contain any picture.

  + I can find a millionaire in this room.

  + Every student in the classroom is at least 5 feet tall.

  + There is a student who knows how to spaek German. 
  
]

#prob[
  Write the following statements using quatifiers and write the negation in the plane english. Finally, write the negation in terms of quatifiers. The first example is solved. I will write negation in red color. 

  + There is a rotten apple in the basket of apples.

    #text(rgb("#3333ff"))[
      Let $cal(A)$ be the set of all apples in the basket. 
        - $exists " " a in cal(A)$ ($a$ is rotten). 

        - #text(red)[
          For any apple in the basket, the apple is not rotten. 
        ]

        - #text(red)[
          $forall " " a in cal(A)$ ($a$ is not rotten).
        ]
    ]

  + All students of SPNREC Araria are from Bihar. 

  + Every classroom has a smartboard. 

  + Every page in this book contains at least 500 words.

  + All tables in the room are dirty.

  + There exists a student in the classroom who is at least 6 feet tall.

  + In this book some pages do not contain any picture.

  + Given any book on the table, it contains a preface.

  + There is a fuse tubelight in the classroom.  

  + Each lady in this room is either intelligent or beautiful. 

  + There is a student in the class who is hardworking or intelligent.

  + Every student in the class is hardworking or intelligent.
]

#pagebreak()
#prob[
  Write the negation of the following statements. The first example is shown. 

  + The boy is intelligent and handsome. 

    - #text(red)[The boy is either not intelligent or not hansome.] 
    
      This statement can also be seen as #text(blue)[The boy is intelligent and the boy is handsome] and the negation can be written as #text(red)[The boy is not intelligent or the boy is not handsome].

  + Sumit and Amit both are intelligent.

  + The classroom has a white board and a black board. 

  + Calculus and Linear Algebra both are in the syllabus. 

  + Either India or South Africa will make to the final.

  + The book belongs to either Vikas or Nitin. 

  + Neither my father nor I have studied History.

  + $a <= b$.
]

#prob[
  Write the negation of the following statements. 

  + If the apple is red, then it is ripe.

  + If I will go to the school, I will get a sweet. 

  + The boy is rich, if he owns a BMW car.

  + The two boys stay in the same house, if they are brothers.

  + The mobile handset has a camera implies that it has Wi-Fi hot-spot.

  + If the student is good in mathematics, then he is humble.

  + If it will rain, then I will not go to school. 
]