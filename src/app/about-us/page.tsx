
import { MapPin, Phone, Mail, Clock, Award, BookOpen, GraduationCap, Users, Trophy } from "lucide-react";

import { DynamicFacultyCarousel } from "@/components/faculties/DynamicFacultyCarousel";
import { CountUpNumber } from "@/components/CountUpNumber";

const branches = [
    {
        id: 1,
        name: "SoftCrayons - Noida Branch",
        address: "C-6 (First Floor), Sector 2, Near Sector 15 Metro Station, Noida, Uttar Pradesh 201301",
        phone: "+91 8545012345",
        altPhone: "",
        email: "info@softcrayons.in",
        timing: "Mon - Sun: 9:00 AM - 7:00 PM",
    },
    {
        id: 2,
        name: "SoftCrayons - Ghaziabad Branch",
        address: "A-693, Vasundhara, Sector 14-A, Ghaziabad, Uttar Pradesh 201010",
        phone: "+91 8545012345",
        altPhone: "",
        email: "info@softcrayons.in",
        timing: "Mon - Sun: 9:00 AM - 7:00 PM",
    },
];

const stats = [
    { icon: GraduationCap, value: "15+", label: "Years Experience" },
    { icon: Users, value: "10000+", label: "Students Trained" },
    { icon: BookOpen, value: "50+", label: "Courses Offered" },
    { icon: Trophy, value: "95%", label: "Placement Rate" },
];

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background brand-section">
            <main>
                <section className="pt-32 pb-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center brand-panel rounded-md p-6 md:p-10">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
                                <span className="text-gradient">Your Success Story </span> Starts Here
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                                SoftCrayons is a leading IT training institute dedicated to transforming
                                aspiring professionals into industry-ready experts. With years of experience
                                and a commitment to excellence, we provide comprehensive training programs
                                that bridge the gap between academia and industry.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                                        <CountUpNumber value={stat.value} className="text-4xl md:text-5xl font-black text-foreground mb-1" />
                                        <div className="text-muted-foreground font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-muted/45">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="brand-eyebrow mb-4">
                                Our Locations
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
                                Visit Our <span className="text-gradient">Branches</span>
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We have multiple locations to serve you better
                            </p>
                        </div>

                        <div className="space-y-12 max-w-5xl mx-auto">
                            {branches.map((branch, index) => (
                                <div
                                    key={branch.id}
                                    className="grid md:grid-cols-2 gap-8 items-center"
                                >
                                    <div className={`brand-panel rounded-md min-h-[300px] flex items-center justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                                <MapPin className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="text-muted-foreground font-medium">
                                                Google Map will be added here
                                            </p>
                                        </div>
                                    </div>

                                    <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                        <span className="inline-block px-3 py-1 rounded-md bg-secondary/10 text-secondary text-sm font-bold mb-4">
                                            {index === 0 ? "Noida Branch" : "Ghaziabad Branch"}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                                            {branch.name}
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4 group cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Address</p>
                                                    <p className="text-muted-foreground">{branch.address}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 group cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                                                    <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Phone</p>
                                                    <p className="text-muted-foreground">{branch.phone}</p>
                                                    {branch.altPhone && <p className="text-muted-foreground">{branch.altPhone}</p>}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 group cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                                                    <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Email</p>
                                                    <p className="text-muted-foreground">{branch.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 group cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                                                    <Clock className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Working Hours</p>
                                                    <p className="text-muted-foreground">{branch.timing}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="brand-eyebrow mb-4">
                                Our Team
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
                                Meet Our Expert <span className="text-gradient">Faculties</span>
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Learn from industry professionals with years of real-world experience
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <DynamicFacultyCarousel />
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6">
                                Start Your Journey <span className="text-gradient">With Us</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                                Join thousands of successful professionals who have transformed their
                                careers with SoftCrayons. Whether you&apos;re a fresher looking to start
                                your IT career or a professional seeking to upskill, we have the right
                                program for you.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 group cursor-pointer hover:bg-primary transition-colors">
                                    <Award className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                    <span className="font-medium text-foreground group-hover:text-white transition-colors">ISO Certified</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 group cursor-pointer hover:bg-primary transition-colors">
                                    <Users className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                    <span className="font-medium text-foreground group-hover:text-white transition-colors">Expert Trainers</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 group cursor-pointer hover:bg-primary transition-colors">
                                    <BookOpen className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                    <span className="font-medium text-foreground group-hover:text-white transition-colors">Industry Curriculum</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
