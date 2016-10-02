#Network Monitoring Paper Review
- URL: http://www.ijiee.org/papers/280-N011.pdf
- Title: An Efficient Network Monitoring and Management System
- Authors: Rafiullah Khan, Sarmad Ullah Khan, Rifaqat Zaheer, and Muhammad Inayatullah Babar 
- Notes: This describes using Nagios in detail, which could be INCREDIBLY useful later because it turns out Nagios has a JSON API. My chat bot + Nagios API could be an awesome way of getting incredibly detailed information to the end user (admin). Worth exploring.

##Review

According to Khan et al. 2013, large organizations require fast and efficient network monitoring systems which reports to a network administrator via email or SMS as soon as a problem arises, with details of the problem and locations affected. They go on to explain the merits of Nagios(A network monitoring tool) and its role in their system. It is extremely important, they mention, that the system be essentially autonomous in operation, as in a large company manual monitoring is very difficult.

The paper contains some basic instruction for configuring a Nagios setup and defines several ways for the software to check the status of various servers and services, and could act as a good guide for somebody new to Nagios configuration. However, the paper does not explore additional ways of informing administrators of issues, nor does it compare other software that may have similar features. 

###Citation
Rafiullah Khan, Sarmad Ullah Khan, Rifaqat Zaheer, and M. I. B. (2013) ‘An Efficient Network Monitoring and Management System’, International Journal of Information and Electronics Engineering, 3(1), p. 122. doi: 10.7763/IJIEE.2013.V3.280.

#Natural Language Parsing Paper Review
- Url: http://www.jmlr.org/papers/volume12/collobert11a/collobert11a.pdf
- Title: Natural Language Processing (Almost) from Scratch
- Authors: Ronan Collobert, Jason Weston, Léon Bottou, Michael Karlen, Koray Kavukeuoglu, Pavel Kuksa
- Notes: Jason Weston was a research scientist at NEC Labs, Google and Facebook. That's some freaking pedigree right there.

##Review

No consensus has emerged whether a piece of software will ever be able to convert English text into a programmer friendly data structure that describes the meaning of the text, according to a paper by Collobert et al. 2011. The paper was written to attempt to build a natural language parser using a huge database of training data, and documenting the process of machine learning.

The paper criticizes itself, noting that they used multilayer neutral networks (a 20 year old technology) rather than something more modern, though they also note that the training algorithm used was only possible due to the tremendous progress in computer hardware. Due to their notably unique approach of trying to build from scratch, much potentially relevant information from other journals and previous experiments could be construed as missing.

###Citation
Collobert, R., Weston, J. and Bottou, L. (2011) ‘Natural language processing (almost) from scratch’, The Journal of Machine …, 12, pp. 2493–2537. doi: 10.1145/2347736.2347755.