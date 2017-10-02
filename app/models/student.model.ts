export class StudentModel {
    constructor
      (
        public id: string,
        public Email: string,
        public AdminPassword: string,
        public Date: string,
        public Instrument: number, 
        public Name: string,
        public PracticeLength: number,        
        public PracticesCompleted: number,
        public PracticesRequired: number,        
        public Reward: string,
        public TeacherId: string,
        public TeacherEmail: string,
        public NotifyAll: boolean  
      )
      {}   
}