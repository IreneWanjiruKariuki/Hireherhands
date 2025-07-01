const workersData = [
    {
        id: 1,
        name: "Alex",
        email: "alex.t@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-15",
        status: "requests",
        experience: "5 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "aws-cert-alex.pdf"
            },
            {
                file: "react-cert-alex.pdf"
            }
        ]
    },
    {
        id: 2,
        name: "Maria Wangui",
        email: "maria.wangui@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-10",
        status: "approved",
        experience: "7 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.8,
        completedJobs: 23,
        approvalDate: "2024-01-12"
    },
    {
        id: 3,
        name: "David Chege",
        email: "david.chege@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-08",
        status: "approved",
        experience: "4 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.6,
        completedJobs: 18,
        approvalDate: "2024-01-10"
    },
    {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-05",
        status: "rejected",
        experience: "2 years",
        skills: ["painting", "Plumbing", "cementing"],
        rejectionDate: "2024-01-07",
        rejectionReason: "Insufficient experience for current project requirements"
    },
    {
        id: 5,
        name: "Jennifer odhiambo",
        email: "jennifer.odhiambo@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-20",
        status: "requests",
        experience: "6 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "google-data-cert-jennifer.pdf"
            },
            {
                file: "tensorflow-cert-jennifer.pdf"
            }
        ]
    },
    {
        id: 6,
        name: "Michael Bass",
        email: "michael.bass@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-18",
        status: "approved",
        experience: "8 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.9,
        completedJobs: 31,
        approvalDate: "2024-01-20"
    },
    {
        id: 7,
        name: "Lisa Wangui",
        email: "lisa.wangui@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-22",
        status: "requests",
        experience: "3 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "vue-cert-lisa.pdf"
            }
        ]
    },
    {
        id: 8,
        name: "Robert Owen",
        email: "robert.owen@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-12",
        status: "approved",
        experience: "5 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.7,
        completedJobs: 15,
        approvalDate: "2024-01-14"
    },
    {
        id: 9,
        name: "Emma Faith",
        email: "emma.faith@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-08",
        status: "rejected",
        experience: "2 years",
        skills: ["painting", "Plumbing", "cementing"],
        rejectionDate: "2024-01-10",
        rejectionReason: "Limited experience with required technologies"
    },
    {
        id: 10,
        name: "James",
        email: "james.@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-25",
        status: "requests",
        experience: "4 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "angular-cert-james.pdf"
            },
            {
                file: "mongodb-cert-james.pdf"
            }
        ]
    }
];
let currentFilter = 'requests';
let currentPage = 1;
const itemsPerPage = 4;
let filteredWorkers = [];
let selectedWorkerId = null;