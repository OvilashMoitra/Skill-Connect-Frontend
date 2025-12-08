import { Link } from '@tanstack/react-router';

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Banner / Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-base font-semibold uppercase tracking-wide text-primary sm:text-lg lg:text-base xl:text-lg">
                  Welcome to SkillConnect
                </span>
                <span className="mt-1 block text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                  Connect. Collaborate. Create.
                </span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                A platform for developers and project managers to build amazing things together. Manage projects, track tasks, and showcase your skills.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                <div className="gap-4 flex flex-col sm:flex-row justify-center lg:justify-start">
                   <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-5 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                    <div className="relative block w-full bg-card rounded-lg overflow-hidden">
                         <div className="p-8 text-center">
                             <h3 className="text-2xl font-bold text-foreground mb-4">Empowering Teams everywhere</h3>
                            <p className="text-muted-foreground">Join thousands of developers and managers who trust SkillConnect for their project needs.</p>
                         </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (Minimal) */}
      <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      Streamline Your Workflow
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                      Everything you need to manage your projects effectively.
                  </p>
              </div>
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-border bg-background p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
</svg>

                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Project Management</h3>
                      <p className="mt-2 text-muted-foreground">Organize tasks, track progress, and meet deadlines with ease.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-2.988M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
</svg>
                      </div>
                       <h3 className="text-lg font-semibold text-foreground">Team Collaboration</h3>
                      <p className="mt-2 text-muted-foreground">Work together seamlessly with your team members in real-time.</p>
                  </div>
                   <div className="rounded-lg border border-border bg-background p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>

                      </div>
                       <h3 className="text-lg font-semibold text-foreground">User Profiles</h3>
                      <p className="mt-2 text-muted-foreground">Build your professional profile and showcase your skills to the world.</p>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}
