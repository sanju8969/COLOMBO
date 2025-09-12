import { z } from "zod";

// User validation schemas
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "faculty", "student", "alumni"]),
  phone: z.string().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

// Department validation schemas
export const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  code: z.string().min(2, "Department code must be at least 2 characters"),
  description: z.string().optional(),
  head_of_department: z.string().uuid().optional().or(z.literal("")),
});

// Course validation schemas
export const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  code: z.string().min(2, "Course code must be at least 2 characters"),
  description: z.string().optional(),
  credits: z.number().min(1, "Credits must be at least 1").max(10, "Credits cannot exceed 10"),
  semester: z.number().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  department_id: z.string().uuid("Please select a department"),
});

// Faculty validation schemas
export const facultySchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  employee_id: z.string().min(2, "Employee ID must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  department_id: z.string().uuid("Please select a department"),
  experience_years: z.number().min(0, "Experience cannot be negative").optional(),
});

// Notice validation schemas
export const noticeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.string().min(1, "Please select a notice type"),
  priority: z.number().min(1, "Priority must be between 1-5").max(5, "Priority must be between 1-5"),
  target_audience: z.string().min(1, "Please select target audience"),
  publish_date: z.date().optional(),
  expire_date: z.date().optional(),
  is_published: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.publish_date && data.expire_date) {
      return data.expire_date > data.publish_date;
    }
    return true;
  },
  {
    message: "Expire date must be after publish date",
    path: ["expire_date"],
  }
);

// Gallery validation schemas
export const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  image_url: z.string().url("Please enter a valid image URL"),
});

// Alumni validation schemas
export const alumniSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  graduation_year: z.number().min(1950, "Invalid graduation year").max(new Date().getFullYear(), "Graduation year cannot be in the future"),
  course: z.string().min(2, "Course must be at least 2 characters"),
  current_position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  bio: z.string().optional(),
});

// Assignment validation schemas
export const assignmentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  course_id: z.string().uuid("Please select a course"),
  due_date: z.date().min(new Date(), "Due date must be in the future"),
  max_marks: z.number().min(1, "Max marks must be at least 1").max(1000, "Max marks cannot exceed 1000"),
});

// Grade validation schemas
export const gradeSchema = z.object({
  enrollment_id: z.string().uuid("Please select an enrollment"),
  assessment_type: z.string().min(1, "Please select assessment type"),
  marks_obtained: z.number().min(0, "Marks cannot be negative"),
  max_marks: z.number().min(1, "Max marks must be at least 1"),
  grade: z.string().optional(),
  remarks: z.string().optional(),
}).refine(
  (data) => data.marks_obtained <= data.max_marks,
  {
    message: "Marks obtained cannot exceed max marks",
    path: ["marks_obtained"],
  }
);

export type UserFormData = z.infer<typeof userSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type FacultyFormData = z.infer<typeof facultySchema>;
export type NoticeFormData = z.infer<typeof noticeSchema>;
export type GalleryFormData = z.infer<typeof gallerySchema>;
export type AlumniFormData = z.infer<typeof alumniSchema>;
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
export type GradeFormData = z.infer<typeof gradeSchema>;